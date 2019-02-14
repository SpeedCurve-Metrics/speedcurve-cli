const SpeedCurve = require("../index")
const DeployResult = require("../model/deploy-result")
const log = require("../log")
const api = require("../api")

module.exports = async function deploy({ key, site = [], note = "", detail = "", wait = false }) {
  const results = await SpeedCurve.deploys.create(key, note, detail, site)
  const successfulResults = results.filter(result => result.success)

  if (wait) {
    log.stdout(`Waiting for all tests to complete...`)

    const totalTests = DeployResult.countTests(successfulResults)

    const updateDeployStatus = async () => {
      const ps = successfulResults.map(result =>
        api
          .deployStatus(key, result.deployId)
          .then(res => {
            result.updateFromApiResponse(res)
          })
          .catch(err => {
            log.notice(
              `Couldn't retrieve deploy status for site ${result.site.name}: ${err.message}`
            )
          })
      )

      await Promise.all(ps)

      const completedTests = DeployResult.countCompletedTests(successfulResults)
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
