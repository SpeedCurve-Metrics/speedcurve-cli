const deploys = require("./deploys")
const sites = require("./sites")
const tests = require("./tests")
const DeployResult = require("./model/deploy-result")
const Site = require("./model/site")
const Url = require("./model/url")

/**
 * Note: All interaction with the SpeedCurve API requires your
 * {@link https://support.speedcurve.com/apis/synthetic-api|SpeedCurve API key}
 * @name SpeedCurve
 * @example
 * const SpeedCurve = require('speedcurve')
 */
const exported = {
  deploys,
  sites,
  tests,
  DeployResult,
  Site,
  Url
}

module.exports = exported
