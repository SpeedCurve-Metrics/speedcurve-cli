/**
 * An object containing all metrics collected during a synthetic test run
 * @typedef {Object} TestResultApiResponse
 */

/**
 * An object representing a SpeedCurve synthetic test result. See the
 * {@link https://api.speedcurve.com/#get-all-sites|API documentation} for a
 * description of the data object.
 */
class TestResult {
  /**
   * @param {Object} data
   */
  constructor(data) {
    /** @type {Object} */
    this.data = data
  }

  /**
   * Build a new {@link TestResult} object from a {@link https://api.speedcurve.com/#get-all-sites|/v1/sites}
   * API response object
   * @param {TestResultApiResponse} response
   * @return {TestResult}
   */
  static fromApiResponse(response) {
    return new TestResult(response)
  }
}

module.exports = TestResult
