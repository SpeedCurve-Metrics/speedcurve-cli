const SpeedCurve = require("../index")
const pluralise = require("../util/pluralise")
const log = require("../log")

module.exports = async function deployStatus({ key, deployId }) {
  const status = await SpeedCurve.deploys.status(key, deployId)
  const completed = status["tests-completed"].length
  const remaining = status["tests-remaining"].length
  const total = completed + remaining

  if (remaining) {
    log.stdout(
      `Deploy in progress. ${remaining} ${pluralise(
        "test",
        remaining
      )} remaining (${completed} / ${total} completed)\n`
    )
  } else {
    log.ok(`Deploy complete. ${total} tests completed.`)
  }
}
