const api = require("./api")
const Site = require("./model/site")

/**
 * Retrieve information about SpeedCurve sites
 * @example
 * const sites = require('speedcurve').sites
 */
const sites = {
  /**
   * Get the details of a SpeedCurve site
   *
   * @param {String} key - Your SpeedCurve API key
   * @param {Number} [siteId] - ID of the site to get
   * @return {Promise<Site, Error>}
   */
  get(key, siteId) {
    return api.site(key, siteId)
  },

  /**
   * Get the details of all sites in a SpeedCurve account
   *
   * @param {String} key - Your SpeedCurve API key
   * @return {Promise<Array<Site>, Error>}
   */
  getAll(key) {
    return api.sites(key).then(res => res.map(data => Site.fromApiResponse(data)))
  }
}

module.exports = sites
