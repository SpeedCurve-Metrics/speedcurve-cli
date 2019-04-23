const SpeedCurve = require("../index")
const log = require("../log")

// Take an array of site IDs or names and convert it to an array of just site IDs
module.exports = async function resolveSiteIds(key, siteIdsOrNames) {
  const needsLookup = siteIdsOrNames.some(x => typeof x === "string")
  const sites = await (needsLookup ? SpeedCurve.sites.getAll(key) : [])

  return Promise.all(
    siteIdsOrNames.map(siteIdOrName => {
      if (typeof siteIdOrName === "string") {
        const siteByName = sites.find(site => site.name === siteIdOrName)

        if (!siteByName) {
          log.warn(`Couldn't find site by name "${siteIdOrName}". Will try to use it as an ID.`)
          return siteIdOrName
        }

        return siteByName.siteId
      }

      // Assume a valid site ID
      return Promise.resolve(siteIdOrName)
    })
  )
}
