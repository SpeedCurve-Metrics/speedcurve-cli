const SpeedCurve = require("../index")
const { bold } = require("../util/console")
const log = require("../log")

module.exports = async function budgetsCommand({ key, json = false }) {
  const budgets = await SpeedCurve.budgets.getAll(key)

  if (json) {
    log.stdout(JSON.stringify(budgets))
  } else {
    budgets.forEach(budget => {
      const budgetTitle = `${bold(budget.metricName)} in ${bold(budget.chart.title)}`

      if (budget.status === "over") {
        log.bad(bold(`${budgetTitle} is ${bold("over budget")}`))
      } else {
        log.ok(bold(`${budgetTitle} is ${bold("under budget")}`))
      }

      budget.crossings.forEach(crossing => {
        const value = budget.getLatestYValue(crossing, true)
        const pctDiff = Math.round(crossing.difference_from_threshold * 100)

        log.stdout(
          `${crossing.name} is currently ${bold(value)} (${pctDiff}% ${bold(
            crossing.status
          )} ${bold("budget")})\n`
        )
      })

      log.stdout("\n")
    })
  }
}
