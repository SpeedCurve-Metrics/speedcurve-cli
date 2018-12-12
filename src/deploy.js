const log = require("./log")
const api = require("./api")
const Result = require("./result")
const pl = require("./pluralise")

module.exports = async function deployCommand(config) {
  const allSuccessfulResults = []

  for (const i in config.teams) {
    const team = config.teams[i]

    if (!team.name) {
      team.name = `teams[${i}]`
    }

    if (!team.key) {
      log.error(`Invalid configuration: ${team.name} is missing the "key" property`)
      continue
    }

    if (team.sites && team.sites.length) {
      log.verbose(`Deploying sites [${team.sites.join(", ")}] in ${team.name}`)
    } else {
      log.verbose(`No sites specified. Deploying all sites in ${team.name}`)

      try {
        team.sites = (await api.sites(team.key)).map(s => s.site_id)
      } catch (err) {
        log.error(`Error fetching sites for ${team.name}: ${err.message}`)
      }
    }

    if (!team.sites || !team.sites.length) {
      log.warn(`No sites for ${team.name}`)
      continue
    }

    const results = team.sites.map(siteId => new Result(siteId, team))
    const ps = results.map(result =>
      api
        .deploy(team.key, result.siteId, config.note, config.detail)
        .then(res => {
          if (res.status === "success") {
            result.updateFromApiResponse(res)
          } else {
            log.error(`Couldn't deploy site ${result.siteId} in ${team.name}: ${res.message}`)
          }
        })
        .catch(err => {
          log.error(`Couldn't deploy site ${result.siteId} in ${team.name}: ${err.message}`)
        })
    )

    await Promise.all(ps)

    const successfulResults = results.filter(result => result.deployId)
    successfulResults.forEach(r => allSuccessfulResults.push(r))

    if (successfulResults.length) {
      const tests = Result.countTests(successfulResults)
      const n = successfulResults.length

      log.ok(
        `Triggered ${n} ${pl("deploy", n)} (${tests} ${pl("test", tests)}) for ${team.name}`
      )
    } else {
      log.error(`No deploys were triggered for ${team.name}`)
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
              `Couldn't retrieve deploy status for site ${result.siteId} in team ${
                result.teamName
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
