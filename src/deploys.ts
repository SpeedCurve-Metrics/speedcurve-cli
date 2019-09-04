/** @module deploys */
import { api } from "./api"
import log from "./log"
import DeployResult from "./model/deploy-result"
import Site from "./model/site"
import pl from "./util/pluralise"
import SpeedCurve from "./index"

/**
 * Create and manage SpeedCurve deploys
 * @example
 * const deploys = require('speedcurve').deploys
 */

/**
 * Get the status of a deploy
 * @see {@link http://api.speedcurve.com/#get-a-deploy}
 */
export function status(key: string, deployId: number) {
	return api.deployStatus(key, deployId)
}

/**
 * Run on-demand tests for one or more sites. If no `siteId` parameter is
 * specified, a deploy will be created for all sites in the account
 */
export async function create(key: string, siteIds: number[] = [], note = "", detail = ""): Promise<DeployResult[]> {
	let teamName = "your SpeedCurve team"

	try {
		await api.team(key).then(res => (teamName = res.team))
	} catch (err) {
		log.verbose(`Couldn't fetch team data`)
	}

	let sites: Site[] = []

	if (siteIds && siteIds.length) {
		sites = await Promise.all(
			siteIds.map(siteId => SpeedCurve.sites.get(key, siteId).catch(() => new Site(siteId, `Site #${siteId}`, [])))
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
		.map(site => new DeployResult(site))
		.map(result =>
			api
				.deploy(key, result.site.siteId, note, detail)
				.then(res => {
					if (res.status === "success") {
						result.updateFromApiResponse(res)
						result.success = true

						log.ok(
							`Deploy ${result.deployId} triggered ${result.totalTests} ${pl("test", result.totalTests)} for ${
								result.site.name
							}`
						)
					} else {
						log.error(`Couldn't deploy site ${result.site.name}: ${res.message}`)
					}

					return result
				})
				.catch(err => {
					log.error(`Couldn't deploy site ${result.site.name}: ${err.message}`)

					result.success = false

					return result
				})
		)

	return Promise.all(ps)
}
