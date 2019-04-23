const TestResult = require("./test-result")

/**
 * @typedef {Object} UrlApiResponse
 * @property {Number} url_id
 * @property {String} label
 * @property {String} url
 */

/**
 * An object representing a URL within a SpeedCurve site
 */
class Url {
  /**
   * @param {Number} urlId
   * @param {String} label
   * @param {String} url
   * @param {Array<TestResult>} tests
   */
  constructor(urlId, label, url, tests = []) {
    /** @type {Number} */
    this.urlId = urlId
    /** @type {String} */
    this.label = label
    /** @type {String} */
    this.url = url
    /** @type {Array<TestResult>} */
    this.tests = tests
  }

  /**
   * Build a new {@link Url} object from a {@link https://api.speedcurve.com/#get-all-urls|/v1/urls}
   * API response object
   * @param {UrlApiResponse} response
   * @return {Url}
   */
  static fromApiResponse(response) {
    return new Url(
      response.url_id,
      response.label,
      response.url,
      response.tests ? response.tests.map(test => TestResult.fromApiResponse(test)) : []
    )
  }
}

module.exports = Url
