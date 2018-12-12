const log = require("./log")
const api = require("./api")
const Result = require("./result")
const pl = require("./pluralise")

module.exports = async function deployCommand(config) {
  const allSuccessfulResults = []

  for (const i in config.accounts) {
    const account = config.accounts[i]

    if (!account.name) {
      account.name = `accounts[${i}]`
    }

    if (!account.key) {
      log.error(`Invalid configuration: ${account.name} is missing the "key" property`)
      continue
    }

    if (account.sites && account.sites.length) {
      log.verbose(`Deploying sites [${account.sites.join(", ")}] in ${account.name}`)
    } else {
      log.verbose(`No sites specified. Deploying all sites in ${account.name}`)

      try {
        account.sites = (await api.sites(account.key)).map(s => s.site_id)
      } catch (err) {
        log.error(`Error fetching sites for ${account.name}: ${err.message}`)
      }
    }

    if (!account.sites || !account.sites.length) {
      log.warn(`No sites for ${account.name}`)
      continue
    }

    const results = account.sites.map(siteId => new Result(siteId, account))
    const ps = results.map(result =>
      api
        .deploy(account.key, result.siteId, config.note, config.detail)
        .then(res => {
          if (res.status === "success") {
            result.updateFromApiResponse(res)
          } else {
            log.error(`Couldn't deploy site ${result.siteId} in ${account.name}: ${res.message}`)
          }
        })
        .catch(err => {
          log.error(`Couldn't deploy site ${result.siteId} in ${account.name}: ${err.message}`)
        })
    )

    await Promise.all(ps)

    const successfulResults = results.filter(result => result.deployId)
    successfulResults.forEach(r => allSuccessfulResults.push(r))

    if (successfulResults.length) {
      const tests = Result.countTests(successfulResults)
      const n = successfulResults.length

      log.ok(
        `Triggered ${n} ${pl("deploy", n)} (${tests} ${pl("test", tests)}) for ${account.name}`
      )
    } else {
      log.error(`No deploys were triggered for ${account.name}`)
    }
  }

  if (config.wait) {
    log.stdout(`Waiting for all tests to complete...`)

    const totalTests = Result.countTests(allSuccessfulResults)

    const updateDeployStatus = async () => {
      const ps = allSuccessfulResults.map(result =>
        api
          .deployStatus(result.key, result.deployId)
          .then(res => {
            result.updateFromApiResponse(res)
          })
          .catch(err => {
            log.notice(
              `Couldn't retrieve deploy status for site ${result.siteId} in account ${
                result.accountName
              }: ${err.message}`
            )
          })
      )

      await Promise.all(ps)

      const completedTests = Result.countCompletedTests(allSuccessfulResults)

      log.stdout(`\rWaiting for all tests to complete... ${completedTests} / ${totalTests}`)

      if (completedTests < totalTests) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(updateDeployStatus())
          }, 5000)
        })
      }
    }

    updateDeployStatus().then(() => {
      log.stdout("\n")
      log.ok("All tests completed")
    })
  }
}
