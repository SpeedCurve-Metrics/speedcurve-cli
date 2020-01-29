import * as SpeedCurve from "../index"
import log from "../log"
import { resolveSiteIds } from "../util/resolve-site-ids"

interface TestsCommandOptions {
	key: string
	site: string | number
	url: number[]
	days?: number
	region?: string
	browser?: string
}

export default async function testsCommand(opts: TestsCommandOptions) {
	const { key, site, url = [], days = 1, region, browser } = opts
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

	log.json(urls)
}

module.exports = testsCommand
