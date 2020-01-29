import * as SpeedCurve from "../index"
import log from "../log"
import { resolveSiteId } from "../util/resolve-site-ids"

interface CreateUrlCommandOptions {
	key: string
	json: boolean
	site: number
	url: string
	label?: string
}

export default async function createUrlCommand(opts: CreateUrlCommandOptions) {
	const { key, json = false, site, url, label } = opts
	const siteId = await resolveSiteId(key, site)

	try {
		const response = await SpeedCurve.urls.create(key, {
			siteId,
			url,
			label
		})

		if (json) {
			log.json(response)
		} else {
			log.ok(`URL ${response.url_id} was created`)
		}
	} catch (e) {
		log.error(`Couldn't create URL. ${e.error.message}`)
	}
}

module.exports = createUrlCommand
