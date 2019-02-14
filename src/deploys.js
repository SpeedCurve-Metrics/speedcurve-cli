const log = require("./log")
const api = require("./api")
const DeployResult = require("./model/deploy-result")
const pl = require("./util/pluralise")

/**
 * Create and manage SpeedCurve deploys
 * @example
 * const deploys = require('speedcurve').deploys
 */
const deploys = {
  /**
   * Get the status of a deploy
   * @param {String} key - Your SpeedCurve API key
   * @param {Number} deployId - The ID of an existing deploy
   * @return {Promise<Object>}
   * @see {@link http://api.speedcurve.com/#get-a-deploy}
   */
  status(key, deployId) {
    return api.deployStatus(key, deployId)
  },

  /**
   * Run on-demand tests for one or more sites. If no `siteId` parameter is
   * specified, a deploy will be created for all sites in the account
   *
   * @param {String} key - Your SpeedCurve API key
   * @param {String} note - A short note for this deploy
   * @param {String} detail - Longer expanded detail for this deploy
   * @param {Array<Number>} [sites] - An array of site IDs to run tests for
   * @return {Promise<Array<DeployResult>, Error>}
   */
  async create(key, note = "", detail = "", sites = []) {
    let teamName = "your SpeedCurve team"

    try {
      await api.team(key).then(res => (teamName = res.team))
    } catch (err) {
      log.verbose(`Couldn't fetch team data`)
    }

    if (sites && sites.length) {
      sites = await Promise.all(
        sites.map(siteId =>
          api.site(key, siteId).catch(() => ({ site_id: siteId, name: `Site #${siteId}` }))
        )
      )
    } else {
      log.verbose(`No sites specified. Deploying all sites in ${teamName}`)

      try {
        sites = await api.sites(key)
      } catch (err) {
        log.error(`Error fetching sites for ${teamName}: ${err.message}`)
      }
    }

    if (!sites || !sites.length) {
      log.warn(`No sites for ${teamName}`)
    }

    const ps = sites
      .map(site => new DeployResult(site))
      .map(result =>
        api
          .deploy(key, result.site.site_id, note, detail)
          .then(res => {
            if (res.status === "success") {
              result.updateFromApiResponse(res)
              result.success = true

              log.ok(
                `Triggered ${result.tests} ${pl("test", result.tests)} for ${result.site.name}`
              )
            } else {
              log.error(`Couldn't deploy site ${result.site.name}: ${res.message}`)
            }

            return result
          })
          .catch(err => {
            log.error(`Couldn't deploy site ${result.site.name}: ${err.message}`)

            return { success: false }
          })
      )

    return Promise.all(ps)
  }
}

module.exports = deploys
