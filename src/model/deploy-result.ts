/** @module SpeedCurve */
import { CreateDeployApiResponse, DeployStatusApiResponse } from "../api"
import Site from "./site"
import Url from "./url"

/**
 * An object representing a SpeedCurve deploy result.
 */
export default class DeployResult {
	deployId: number
	site: Site
	url: Url
	success: boolean
	totalTests: number
	completedTests: number

	constructor(siteOrUrl: Site | Url) {
		if ("urlId" in siteOrUrl) {
			this.url = siteOrUrl
			this.site = siteOrUrl.site
		} else {
			this.site = siteOrUrl
		}

		this.deployId = null
		this.success = false
		this.totalTests = 0
		this.completedTests = 0
	}

	updateFromApiResponse(response: CreateDeployApiResponse | DeployStatusApiResponse) {
		this.deployId = response.deploy_id

		if (typeof (response as CreateDeployApiResponse)["tests-requested"] !== "undefined") {
			this.totalTests = (response as CreateDeployApiResponse)["tests-requested"]
		}

		if (typeof (response as DeployStatusApiResponse)["tests-completed"] !== "undefined") {
			this.completedTests = (response as DeployStatusApiResponse)["tests-completed"].length
		}
	}

	/**
	 * Returns the total number of tests in a collection of DeployResults.
	 */
	static countTests(resultsCollection: DeployResult[]) {
		return resultsCollection.reduce((sum, result) => sum + result.totalTests, 0)
	}

	/**
	 * Returns the number of tests that have been completed in a collection of DeployResults.
	 */
	static countCompletedTests(resultsCollection: DeployResult[]) {
		return resultsCollection.reduce((sum, result) => sum + result.completedTests, 0)
	}
}
