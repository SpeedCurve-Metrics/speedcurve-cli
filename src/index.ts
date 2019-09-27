/** @module SpeedCurve */
import * as budgets from "./budgets"
import * as deploys from "./deploys"
import DeployResult from "./model/deploy-result"
import PerformanceBudget from "./model/performance-budget"
import Site from "./model/site"
import TestResult from "./model/test-result"
import Url from "./model/url"
import * as sites from "./sites"
import * as tests from "./tests"
import * as urls from "./urls"

/**
 * Note: All interaction with the SpeedCurve API requires your
 * {@link https://support.speedcurve.com/apis/synthetic-api|SpeedCurve API key}
 * ```js
 * const SpeedCurve = require('speedcurve')
 * ```
 */
const SpeedCurve = {
	budgets,
	deploys,
	sites,
	urls,
	tests,
	DeployResult,
	PerformanceBudget,
	Site,
	TestResult,
	Url
}

export default SpeedCurve
module.exports = SpeedCurve
