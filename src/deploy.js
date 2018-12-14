const log = require("./log")
const api = require("./api")
const Result = require("./result")
const pl = require("./pluralise")

module.exports = async function deployCommand(config) {
  const allSuccessfulResults = []

  for (const i in config.teams) {
    const team = config.teams[i]
    team.name = `teams[${i}]`

    try {
      await api.team(config.teams[i].key).then(res => (team.name = res.team))
    } catch {
      log.verbose(`Couldn't fetch data for ${team.name}`)
    }

    if (!team.key) {
      log.error(`Invalid configuration: ${team.name} is missing the "key" property`)
      continue
    }

    if (team.sites && team.sites.length) {
      team.sites = await Promise.all(
        team.sites.map(siteId =>
          api.site(team.key, siteId).catch(() => ({ site_id: siteId, name: `Site #${siteId}` }))
        )
      )
    } else {
      log.verbose(`[${team.name}] No sites specified. Deploying all sites`)

      try {
        team.sites = await api.sites(team.key)
      } catch (err) {
        log.error(`[${team.name}] Error fetching sites: ${err.message}`)
      }
    }

    if (!team.sites || !team.sites.length) {
      log.warn(`No sites for ${team.name}`)
      continue
    }

    const results = team.sites.map(site => new Result(site, team))
    const ps = results.map(result =>
      api
        .deploy(team.key, result.site.site_id, config.note, config.detail)
        .then(res => {
          if (res.status === "success") {
            result.updateFromApiResponse(res)
            allSuccessfulResults.push(result)

            log.ok(
              `[${team.name}] Triggered ${result.tests} ${pl("test", result.tests)} for ${
                result.site.name
              }`
            )
          } else {
            log.error(`[${team.name}] Couldn't deploy site ${result.site.name}: ${res.message}`)
          }
        })
        .catch(err => {
          log.error(`[${team.name}] Couldn't deploy site ${result.site.name}: ${err.message}`)
        })
    )

    await Promise.all(ps)
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
              `Couldn't retrieve deploy status for site ${result.site.name} in team ${
                result.teamName
              }: ${err.message}`
            )
          })
      )

      await Promise.all(ps)

      const completedTests = Result.countCompletedTests(allSuccessfulResults)
      const pctCompleted = Math.round((completedTests / totalTests) * 100)

      log.stdout(
        `\rWaiting for all tests to complete... ${completedTests} / ${totalTests} (${pctCompleted}%)`
      )

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
