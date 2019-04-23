const api = require("./api")
const Url = require("./model/url")

/**
 * Retrieve synthetic test results
 * @example
 * const tests = require('speedcurve').tests
 */
const tests = {
  /**
   * Get the details of an individual test
   *
   * @param {String} key - Your SpeedCurve API key
   * @param {Number} testId - ID of the test to get
   * @return {Promise<TestResult, Error>}
   */
  get(key, testId) {
    return api.test(key, testId)
  },

  /**
   * Get synthetic test results for a SpeedCurve URL
   *
   * @param {String} key - Your SpeedCurve API key
   * @param {Number} urlId - ID of the URL to get tests for
   * @param {Number} days - How many days of tests to get
   * @param {Object} filters
   * @param {String} filters.region - Only include tests from the specified region
   * @param {String} filters.browser - Only include tests from the specified browser
   * @return {Promise<Url, Error>}
   */
  getForUrl(key, urlId, days = 1, filters = {}) {
    return api.tests(key, urlId, days, filters).then(Url.fromApiResponse)
  }
}

module.exports = tests
