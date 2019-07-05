import SpeedCurve from "../index"
import log from "../log"
import pluralise from "../util/pluralise"

interface DeployStatusCommandOptions {
	key: string
	deployId: number
	json: boolean
}

export default async function deployStatusCommand(opts: DeployStatusCommandOptions) {
	const { key, deployId, json = false } = opts
	const status = await SpeedCurve.deploys.status(key, deployId)
	const completed = status["tests-completed"].length
	const remaining = status["tests-remaining"].length
	const total = completed + remaining

	if (json) {
		log.json(status)
	} else {
		if (remaining) {
			log.stdout(
				`Deploy in progress. ${remaining} ${pluralise(
					"test",
					remaining
				)} remaining (${completed} / ${total} completed)\n`
			)
		} else {
			log.ok(`Deploy complete. ${total} tests completed.`)
		}
	}
}

module.exports = deployStatusCommand
