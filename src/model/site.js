const Url = require("./url")

/**
 * @typedef {Object} SiteApiResponse
 * @property {Number} site_id
 * @property {String} name
 * @property {Array<UrlApiResponse>} urls
 */

/**
 * An object representing a SpeedCurve site
 */
class Site {
  /**
   * @param {Number} siteId
   * @param {String} name
   * @param {Array<Url>} urls
   */
  constructor(siteId, name, urls) {
    /** @type {Number} */
    this.siteId = siteId
    /** @type {String} */
    this.name = name
    /** @type {Array<Url>} */
    this.urls = urls
  }

  /**
   * Build a new {@link Site} object from a {@link https://api.speedcurve.com/#get-site-details-and-settings|/v1/sites}
   * API response object
   * @param {SiteApiResponse} response
   * @return {Site}
   */
  static fromApiResponse(response) {
    return new Site(
      response.site_id,
      response.name,
      response.urls.map(url => Url.fromApiResponse(url))
    )
  }
}

module.exports = Site
