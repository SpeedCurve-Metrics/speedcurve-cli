import SpeedCurve from "../index"
import log from "../log"
import Site from "../model/site"

type SiteIdOrName = string | number

const sitesCache: { [key: string]: Site[] } = {}

async function populateSitesCacheForAccount(key: string): Promise<void> {
	await SpeedCurve.sites.getAll(key).then(sites => {
		sitesCache[key] = sites
	})
}

/*
 * Find the corresponding site ID for a site name
 */
export async function resolveSiteId(key: string, siteIdOrName: SiteIdOrName): Promise<number> {
	if (typeof siteIdOrName === "string") {
		if (!sitesCache[key]) {
			await populateSitesCacheForAccount(key)
		}

		const siteByName = sitesCache[key].find(site => site.name === siteIdOrName)

		if (siteByName) {
			return siteByName.siteId
		}

		log.verbose(`Couldn't find site by name "${siteIdOrName}". Will try to use it as an ID.`)
	}

	return Number(siteIdOrName)
}

export async function resolveSiteIds(key: string, siteIdsOrNames: SiteIdOrName[]): Promise<number[]> {
	const needsLookup = siteIdsOrNames.some(x => typeof x === "string")
	if (needsLookup) {
		await populateSitesCacheForAccount(key)
	}

	return Promise.all(siteIdsOrNames.map(siteIdOrName => resolveSiteId(key, siteIdOrName)))
}
