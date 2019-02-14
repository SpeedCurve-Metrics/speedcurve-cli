/**
 * An object representing a SpeedCurve deploy result.
 */
class DeployResult {
  /**
   * @param {Site} site
   */
  constructor(site) {
    /**
     * The site that this result is for
     * @type {Site}
     */
    this.site = site

    /**
     * A unique ID for this deploy result
     * @type {Number}
     */
    this.deployId = null

    /**
     * Whether this deploy was successful
     * @type {Boolean}
     */
    this.success = false

    /**
     * How many tests were triggered for this deploy
     * @type {Number}
     */
    this.tests = 0

    /**
     * How many tests have been completed so far
     * @type {Number}
     */
    this.completedTests = 0
  }

  /**
   * Returns the total number of tests in a collection of DeployResults.
   *
   * @param {Array<DeployResult>} resultsCollection
   * @return {Number}
   */
  static countTests(resultsCollection) {
    return resultsCollection.reduce((sum, result) => sum + result.tests, 0)
  }

  /**
   * Returns the number of tests that have been completed in a collection of DeployResults.
   *
   * @param {Array<DeployResult>} resultsCollection
   * @return {Number}
   */
  static countCompletedTests(resultsCollection) {
    return resultsCollection.reduce((sum, result) => sum + result.completedTests, 0)
  }

  /**
   * @private
   */
  updateFromApiResponse(res) {
    this.deployId = res.deploy_id

    if (typeof res["tests-requested"] !== "undefined") {
      this.tests = res["tests-requested"]
    }

    if (typeof res["tests-completed"] !== "undefined") {
      this.completedTests = res["tests-completed"].length
    }
  }
}

module.exports = DeployResult
