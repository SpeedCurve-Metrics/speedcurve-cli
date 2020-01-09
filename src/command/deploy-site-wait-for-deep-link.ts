import deployCommand from "./deploy"
import { ExitCode } from "../command"
import log from "../log"

interface DeploySiteWaitForDeepLinkCommandOptions {
	key: string
	site: number[]
	note?: string
	detail?: string
}

const buildDeepLink = (): string => {
	return "buildDeepLink"
}

export default async function deploySiteWaitForDeepLink(
	opts: DeploySiteWaitForDeepLinkCommandOptions
): Promise<ExitCode | void> {
	const deployOpts = { ...opts, wait: true }
	deployCommand(deployOpts).then(log.ok(buildDeepLink()))
}
