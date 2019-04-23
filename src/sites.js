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
   * @param {Number} siteId - ID of the site to get
   * @return {Promise<Site, Error>}
   */
  get(key, siteId) {
    return api.site(key, siteId).then(data => Site.fromApiResponse(data))
  },

  /**
   * Get the details of all sites in a SpeedCurve account
   *
   * @param {String} key - Your SpeedCurve API key
   * @return {Promise<Array<Site>, Error>}
   */
  getAll(key) {
    return api.sites(key).then(res => res.map(data => Site.fromApiResponse(data)))
  },

  /**
   * Get the details of all sites in a SpeedCurve account, including recent median
   * test results.
   *
   * @param {String} key - Your SpeedCurve API key
   * @param {Number} days - How many days of median test results to incldue
   * @return {Promise<Array<Site>, Error>}
   */
  getAllWithTests(key, days) {
    return api.sites(key, true, days).then(res => res.map(data => Site.fromApiResponse(data)))
  }
}

module.exports = sites
