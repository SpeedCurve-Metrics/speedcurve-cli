import SpeedCurve from "../index"
import log from "../log"
import Site from "../model/site"

type SiteIdOrName = string | number

/*
 * Take an array of site IDs or names and convert it to an array of just site IDs
 */
export default async function resolveSiteIds(key: string, siteIdsOrNames: SiteIdOrName[]): Promise<number[]> {
  const needsLookup = siteIdsOrNames.some(x => typeof x === "string")
  const sites: Site[] = await (needsLookup ? SpeedCurve.sites.getAll(key) : Promise.resolve([]))

  return siteIdsOrNames.map(siteIdOrName => {
    if (typeof siteIdOrName === "string") {
      const siteByName = sites.find(site => site.name === siteIdOrName)

      if (!siteByName) {
        log.warn(`Couldn't find site by name "${siteIdOrName}". Will try to use it as an ID.`)
        return Number(siteIdOrName)
      }

      return siteByName.siteId
    }

    // Assume a valid site ID
    return Number(siteIdOrName)
  })
}
