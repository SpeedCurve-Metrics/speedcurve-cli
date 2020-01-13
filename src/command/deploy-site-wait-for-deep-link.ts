import deployCommand from "./deploy"
import listDeploysCommand from "./list-deploys"
import { ExitCode } from "../command"
import log from "../log"

interface DeploySiteWaitForDeepLinkCommandOptions {
	key: string
	siteId: number
	note?: string
	detail?: string
	browser?: string
	region?: string
	url?: number[]
	deepLinkUrl?: number
	shareKey?: string
	selfHostedName?: string
}

export interface ListDeploysCommandOptions {
	key: string
	siteId: number
}

interface BuildUrlParams {
	deployLatest: number
	deployPrevious: number
	siteId: number
	browser?: string
	region?: string
	deepLinkUrl?: number
	shareKey?: string
	selfHostedName?: string
}

interface OptionalParams {
	[key: string]: string | number
	b?: string
	r?: string
	u?: number
	shareKey?: string
}

const baseUrl = "https://speedcurve.com"

const addOptionalParams = (optionalParams: OptionalParams): string[] =>
	Object.keys(optionalParams).map(key => `${key}=${optionalParams[key]}`)

const buildUrl = ({
	deployLatest,
	deployPrevious,
	siteId,
	browser,
	region,
	deepLinkUrl,
	shareKey,
	selfHostedName
}: BuildUrlParams): string => {
	const urlParts = [baseUrl, "deploy"]
	if (selfHostedName) {
		urlParts.splice(1, 0, selfHostedName)
	}
	const requiredParams = [`dl=${deployLatest}`, `dp=${deployPrevious}`, `s=${siteId}`]
	const optionalParams = { b: browser, r: region, u: deepLinkUrl, shareKey }

	const params = [...requiredParams, ...addOptionalParams(optionalParams)]

	const completeUrl = `${urlParts.join("/")}?${params.join("&")}`
	log.ok("Deep link deploy URL created!")
	log.stdout(completeUrl)
	return completeUrl
}

const buildDeepLink = async (opts: DeploySiteWaitForDeepLinkCommandOptions): Promise<ExitCode | string> => {
	const { siteId, browser, region, shareKey, selfHostedName, deepLinkUrl } = opts
	const deploys = await listDeploysCommand(opts)

	if (deploys.length < 1) {
		throw Error("Not enough deploys found to create deep link")
	}
	const deployLatest = deploys[0].deploy_id
	const deployPrevious = deploys[1].deploy_id

	return buildUrl({ deployLatest, deployPrevious, siteId, browser, region, deepLinkUrl, shareKey, selfHostedName })
}

const deploySiteWaitForDeepLink = async (opts: DeploySiteWaitForDeepLinkCommandOptions): Promise<ExitCode | void> => {
	const deployOpts = {
		key: opts.key,
		site: [opts.siteId],
		wait: true,
		note: opts.note,
		detail: opts.detail,
		url: opts.url
	}
	await deployCommand(deployOpts)
	await buildDeepLink(opts)
}

export default deploySiteWaitForDeepLink
