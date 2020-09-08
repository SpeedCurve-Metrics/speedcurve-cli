import * as SpeedCurve from "../index"
import log from "../log"

interface UpdateUrlCommandOptions {
	key: string
	json: boolean
	urlId: number
	url: string
	label?: string
	script?: string
}

export default async function updateUrlCommand(opts: UpdateUrlCommandOptions) {
	const { key, json = false, urlId, url, label, script } = opts

	try {
		const response = await SpeedCurve.urls.update(key, urlId, {
			url,
			label,
			script,
		})

		if (json) {
			log.json(response)
		} else {
			log.ok(`URL ${response.url_id} was updated`)
		}
	} catch (e) {
		log.error(`Couldn't update URL. ${e.error.message}`)
	}
}

module.exports = updateUrlCommand
