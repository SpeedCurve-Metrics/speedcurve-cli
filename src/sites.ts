/**
 * Retrieve information about SpeedCurve sites
 *
 * @example
 *
 * <br>
 * <br>
 *
 * ```
 * const SpeedCurve = require("speedcurve")
 * const sites = await SpeedCurve.sites.getAll(key)
 * ```
 *
 * @packageDocumentation
 */

import { api } from "./api"
import Site from "./model/site"
import * as tests from "./tests"

/**
 * Get the details of a SpeedCurve site
 */
export function get(key: string, siteId: number): Promise<Site> {
	return api.site(key, siteId).then((data) => Site.fromApiResponse(data))
}

/**
 * Get the details of all sites in a SpeedCurve account
 */
export function getAll(key: string): Promise<Site[]> {
	return api.sites(key).then((res) => res.map((data) => Site.fromApiResponse(data)))
}

/**
 * Get the details of all sites in a SpeedCurve account, including recent median
 * test results.
 */
export function getAllWithTests(key: string, days: number): Promise<Site[]> {
	return getAll(key).then(async (sites) => {
		return Promise.all(
			sites.map(async (site) =>
				Promise.all(site.urls.map((url) => tests.getForUrl(key, url.urlId, days))).then((urlsWithTests) => {
					site.urls = urlsWithTests

					return site
				})
			)
		)
	})
}
