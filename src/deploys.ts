/**
 * Create and manage SpeedCurve deploys
 *
 * @example
 *
 * <br>
 * <br>
 *
 * ```
 * const SpeedCurve = require("speedcurve")
 * const deployResults = await SpeedCurve.deploys.create(key)
 * ```
 *
 * @packageDocumentation
 */

import { api, DeployStatusApiResponse } from "./api"
import log from "./log"
import DeployResult from "./model/deploy-result"
import Site from "./model/site"
import Url from "./model/url"
import * as SpeedCurve from "./index"

/**
 * Get the status of a deploy
 * @see {@link http://api.speedcurve.com/#get-a-deploy}
 */
export function status(key: string, deployId: number): Promise<DeployStatusApiResponse> {
	return api.deployStatus(key, deployId)
}

/**
 * Run on-demand tests for one or more sites. If no `siteId` parameter is
 * specified, a deploy will be created for all sites in the account
 */
export async function create(key: string, siteIds: number[] = [], note = "", detail = ""): Promise<DeployResult[]> {
	let teamName = "your SpeedCurve team"

	try {
		await api.team(key).then((res) => (teamName = res.team))
	} catch (err) {
		log.verbose(`Couldn't fetch team data`)
	}

	let sites: Site[] = []

	if (siteIds.length) {
		sites = await Promise.all(
			siteIds.map((siteId) => SpeedCurve.sites.get(key, siteId).catch(() => new Site(siteId, `Site #${siteId}`, [])))
		)
	} else {
		log.verbose(`No sites specified. Deploying all sites in ${teamName}`)

		try {
			sites = await SpeedCurve.sites.getAll(key)
		} catch (err) {
			log.error(`Error fetching sites for ${teamName}: ${err.message}`)
		}
	}

	if (!sites || !sites.length) {
		log.warn(`No sites for ${teamName}`)
	}

	const ps = sites
		.map((site) => new DeployResult(site))
		.map((result) =>
			api
				.deploy(key, { note, detail, site_id: result.site.siteId })
				.then((res) => {
					if (res.status === "success") {
						result.updateFromApiResponse(res)
						result.success = true
					} else {
						log.error(`Couldn't deploy site ${result.site.name}: ${res.message}`)
					}

					return result
				})
				.catch((err) => {
					if (err.error) {
						log.error(`Couldn't deploy site ${result.site.name}: ${err.error.message}`)
					} else {
						log.error(`Couldn't deploy site ${result.site.name}: ${err.message}`)
					}

					result.success = false

					return result
				})
		)

	return Promise.all(ps)
}

/**
 * Run on-demand tests for one or more URLs.
 */
export async function createForUrls(key: string, urlIds: number[], note = "", detail = ""): Promise<DeployResult[]> {
	let teamName = "your SpeedCurve team"

	try {
		await api.team(key).then((res) => (teamName = res.team))
	} catch (err) {
		log.verbose(`Couldn't fetch team data`)
	}

	let urls: Url[] = []

	try {
		const sites = await SpeedCurve.sites.getAll(key)

		for (const site of sites) {
			for (const siteUrl of site.urls) {
				if (urlIds.includes(siteUrl.urlId)) {
					urls.push(siteUrl)
				}
			}
		}
	} catch (err) {
		log.verbose(`Error fetching sites for ${teamName}: ${err.message}`)

		urls = urlIds.map((urlId) => new Url(urlId, "Unknown", "Unknown"))
	}

	const ps = urls
		.map((url) => new DeployResult(url))
		.map((result) =>
			api
				.deploy(key, { note, detail, url_id: result.url.urlId })
				.then((res) => {
					if (res.status === "success") {
						result.updateFromApiResponse(res)
						result.success = true
					} else {
						log.error(`Couldn't deploy ${result.url.toString()}: ${res.message}`)
					}

					return result
				})
				.catch((err) => {
					log.error(`Couldn't deploy ${result.url.toString()}: ${err.message}`)

					result.success = false

					return result
				})
		)

	return Promise.all(ps)
}
