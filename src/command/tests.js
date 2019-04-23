const SpeedCurve = require("../index")
const resolveSiteIds = require("../util/resolve-site-ids")
const log = require("../log")

module.exports = async function tests({ key, site, url = [], days = 1, region, browser }) {
  const siteId = (await resolveSiteIds(key, [site])).pop()
  const siteUrls = (await SpeedCurve.sites.get(key, siteId)).urls

  const resolvedUrlIds = url.map(urlIdOrName => {
    if (typeof urlIdOrName === "string") {
      const urlByName = siteUrls.find(url => url.label === urlIdOrName)

      if (!urlByName) {
        log.warn(`Couldn't find URL by name "${urlIdOrName}". Will try to use it as an ID.`)
        return urlIdOrName
      }

      return urlByName.urlId
    }

    return urlIdOrName
  })

  // If no URLs were specified, fetch tests for all URLs in the site
  const urlIds = resolvedUrlIds.length ? resolvedUrlIds : siteUrls.map(url => url.urlId)

  const ps = urlIds.map(urlId => SpeedCurve.tests.getForUrl(key, urlId, days, { region, browser }))
  const urls = await Promise.all(ps)

  log.stdout(JSON.stringify(urls, null, 4))
}
