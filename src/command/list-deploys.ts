import SpeedCurve from "../index"
// import { Deploy } from "./api"
import log from "../log"

interface ListDeploysCommandOptions {
	key: string
	siteId: number
	json: boolean
}

export default function listDeploysCommand(opts: ListDeploysCommandOptions) {
	// const { key, json = false } = opts
	const { key, siteId } = opts
	console.log("list-deploys.ts:siteId", siteId)

	return SpeedCurve.deploys.list(key, siteId).then(deploys => {
		// const deploysForSite = deploys.filter((deploy: Deploy) => deploy.site_id === siteId)
		console.log(deploys)
		// if (json) {
		log.json(deploys)
		// } else {
		// }
	})
}

module.exports = listDeploysCommand
