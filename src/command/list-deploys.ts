import SpeedCurve from "../index"

export interface ListDeploysCommandOptions {
	key: string
	siteId: number
}

export default function listDeploysCommand(opts: ListDeploysCommandOptions) {
	const { key, siteId } = opts

	return SpeedCurve.deploys.list(key, siteId)
}

module.exports = listDeploysCommand
