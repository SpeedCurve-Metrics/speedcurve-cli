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
   */
  constructor(urlId, label, url) {
    /** @type {Number} */
    this.urlId = urlId
    /** @type {String} */
    this.label = label
    /** @type {String} */
    this.url = url
  }

  /**
   * Build a new {@link Url} object from a {@link https://api.speedcurve.com/#get-all-urls|/v1/urls}
   * API response object
   * @param {UrlApiResponse} response
   * @return {Url}
   */
  static fromApiResponse(res) {
    return new Url(res.url_id, res.label, res.url)
  }
}

module.exports = Url
