const SpeedCurve = require("../index")
const { bold } = require("../util/console")
const DeployResult = require("../model/deploy-result")
const pluralise = require("../util/pluralise")
const resolveSiteIds = require("../util/resolve-site-ids")
const log = require("../log")
const api = require("../api")

module.exports = async function deployCommand(opts) {
  const { key, site = [], note = "", detail = "", checkBudgets = false, wait = false } = opts

  log.stdout(
    `Requesting deploys for ${site.length || "all"} ${pluralise("site", site.length)}...\n`
  )

  const budgetsBeforeDeploy = new Map()

  if (checkBudgets) {
    log.verbose("Determining initial status of performance budgets...\n")

    await SpeedCurve.budgets.getAll(key).then(budgets => {
      budgets.forEach(b => budgetsBeforeDeploy.set(b.budgetId, b))
    })
  }

  const siteIds = await resolveSiteIds(key, site)
  const results = await SpeedCurve.deploys.create(key, note, detail, siteIds)
  const successfulResults = results.filter(result => result.success)

  if (wait || checkBudgets) {
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
        `\rWaiting for tests to complete... ${completedTests} / ${totalTests} (${pctCompleted}%)`
      )

      if (completedTests < totalTests) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(updateDeployStatus())
          }, 5000)
        })
      }
    }

    const maybeCheckBudgets = async () => {
      if (!checkBudgets) {
        return Promise.resolve()
      }

      log.stdout("Checking status of performance budgets...\n")

      const budgetsAfterDeploy = new Map()

      await Promise.all(
        successfulResults.map(result =>
          SpeedCurve.budgets.getByDeployId(key, result.deployId).then(budgets => {
            budgets.forEach(b => budgetsAfterDeploy.set(b.budgetId, b))
          })
        )
      )

      budgetsAfterDeploy.forEach(budget => {
        const prevBudget = budgetsBeforeDeploy.get(budget.budgetId)
        const statusChanged = prevBudget.status !== budget.status
        const stillOver = prevBudget.status === "over" && budget.status === "over"

        // We can't rely on the crossings being in a consistent order, so we
        // reference them by name instead.
        const prevCrossings = new Map()

        prevBudget.crossings.forEach(crossing => {
          prevCrossings.set(crossing.name, crossing)
        })

        const budgetTitle = `${bold(budget.metricName)} in ${bold(budget.chart.title)}`

        if (stillOver) {
          log.warn(bold(`${budgetTitle} is ${bold("still over budget")}`))
        } else if (statusChanged) {
          if (budget.status === "over") {
            log.bad(bold(`${budgetTitle} has ${bold("gone over budget")}`))
          } else {
            log.ok(bold(`${budgetTitle} has ${bold("gone under budget")}`))
          }
        } else {
          log.ok(bold(`${budgetTitle} is ${bold("still under budget")}`))
        }

        budget.crossings.forEach(crossing => {
          const prevCrossing = prevCrossings.get(crossing.name)
          const prevValue = budget.getLatestYValue(prevCrossing, true)
          const newValue = budget.getLatestYValue(crossing, true)
          const pctDiff = Math.round(crossing.difference_from_threshold * 100)

          log.stdout(
            `${crossing.name} ${bold(prevValue)} => ${bold(newValue)} (${pctDiff}% ${
              crossing.status
            } budget)\n`
          )
        })

        log.stdout("\n")
      })
    }

    updateDeployStatus()
      .then(() => {
        log.stdout("\n")
        log.ok("All tests completed")
      })
      .then(maybeCheckBudgets)
  }
}
