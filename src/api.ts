import * as r from "request-promise"
import { URL } from "url"
import log from "./log"
import truncate from "./util/truncate"
const VERSION = require("../package.json").version

const logFriendlyUrl = (url: URL) => {
	const hasSearchParams = [...url.searchParams.values()].length > 0

	return [url.origin, url.pathname, hasSearchParams ? "?" + url.searchParams : ""].join("")
}

export class ApiClient {
	base: string

	constructor() {
		this.base = "https://api.speedcurve.com/"
	}

	prepareUrl(key: string, path: string, searchParams: { [key: string]: string } = {}): URL {
		const url = new URL(path, this.base)

		url.username = key
		url.password = "x"

		for (const key in searchParams) {
			if (typeof searchParams[key] !== "undefined") {
				url.searchParams.set(key, searchParams[key])
			}
		}

		return url
	}

	// The V1 SpeedCurve API does not have consistent error reporting. This
	// method attempts to normalise errors to be of type { message: string }
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	normaliseErrorResponse(e: any): void {
		if (typeof e.error === "string") {
			// API returns a plain text response
			e.error = { message: e.error }
		}

		if (typeof e.error.error === "string") {
			// API returns an { error: string } object
			e.error = { message: e.error.error }
		}

		throw e
	}

	get(url: URL) {
		log.http("GET", logFriendlyUrl(url))

		return r
			.get({
				uri: url.href,
				json: true,
				headers: {
					"user-agent": `speedcurve-cli/${VERSION}`,
				},
			})
			.catch(this.normaliseErrorResponse)
	}

	post(url: URL, data = {}) {
		log.http("POST", `${logFriendlyUrl(url)} ${truncate(JSON.stringify(data), 60)}`)

		return r
			.post({
				uri: url.href,
				json: true,
				form: data,
				headers: {
					"user-agent": `speedcurve-cli/${VERSION}`,
				},
			})
			.catch(this.normaliseErrorResponse)
	}

	put(url: URL, data = {}) {
		log.http("PUT", `${logFriendlyUrl(url)} ${truncate(JSON.stringify(data), 60)}`)

		return r
			.put({
				uri: url.href,
				json: true,
				form: data,
				headers: {
					"user-agent": `speedcurve-cli/${VERSION}`,
				},
			})
			.catch(this.normaliseErrorResponse)
	}

	deploy(key: string, settings: DeployEndpointParameters): Promise<CreateDeployApiResponse> {
		const url = this.prepareUrl(key, `/v1/deploys`)

		return this.post(url, settings).then((res) => res)
	}

	deployStatus(key: string, deployId: number): Promise<DeployStatusApiResponse> {
		const url = this.prepareUrl(key, `/v1/deploys/${deployId}`)

		return this.get(url).then((res) => res)
	}

	team(key: string): Promise<TeamApiResponse> {
		const url = this.prepareUrl(key, "/v1/export")

		return this.get(url).then((res) => res.teams[0])
	}

	site(key: string, siteId: number): Promise<SiteApiResponse> {
		const url = this.prepareUrl(key, `/v1/sites/${siteId}`)

		return this.get(url).then((res) => res.site)
	}

	sites(key: string): Promise<SiteApiResponse[]> {
		const url = this.prepareUrl(key, "/v1/sites")

		return this.get(url).then((res) => res.sites)
	}

	createUrl(key: string, settings: CreateUrlEndpointParameters): Promise<CreateUrlApiResponse> {
		const url = this.prepareUrl(key, "/v1/urls")

		return this.post(url, settings).then((res) => res)
	}

	updateUrl(key: string, urlId: number, settings: UpdateUrlEndpointParameters): Promise<UpdateUrlApiResponse> {
		const url = this.prepareUrl(key, `/v1/urls/${urlId}`)

		return this.put(url, settings).then((res) => res)
	}

	test(key: string, testId: string): Promise<TestResultApiResponse> {
		const url = this.prepareUrl(key, `/v1/tests/${testId}`)

		return this.get(url).then((res) => res)
	}

	tests(key: string, urlId: number, days = 1, filters: TestFilters = {}): Promise<UrlApiResponse> {
		const { region, browser } = filters
		const url = this.prepareUrl(key, `/v1/urls/${urlId}`, { days: `${days}`, region, browser })

		return this.get(url).then((res) => res)
	}

	budgets(key: string): Promise<BudgetApiResponse[]> {
		const url = this.prepareUrl(key, "/v1/budgets")

		return this.get(url).then((res) => res.budgets)
	}

	budgetsForDeploy(key: string, deployId: number): Promise<BudgetApiResponse[]> {
		const url = this.prepareUrl(key, "/v1/budgets", { deploy_id: `${deployId}` })

		return this.get(url).then((res) => res.budgets)
	}
}

export interface TestFilters {
	region?: string
	browser?: string
}

interface BaseDeployEndpointParameters {
	note?: string
	detail?: string
}

interface UrlDeployEndpointParameters extends BaseDeployEndpointParameters {
	url_id: number
}

interface SiteDeployEndpointParameters extends BaseDeployEndpointParameters {
	site_id: number
}

interface CreateUrlEndpointParameters {
	site_id: number
	url: string
	label?: string
	script?: string
	username?: string
	password?: string
}

interface UpdateUrlEndpointParameters {
	url?: string
	label?: string
	script?: string
	username?: string
	password?: string
}

export type DeployEndpointParameters = UrlDeployEndpointParameters | SiteDeployEndpointParameters

export interface SiteApiResponse {
	site_id: number
	name: string
	urls: UrlApiResponse[]
}

export interface UrlApiResponse {
	url_id: number
	label: string
	url: string
	tests?: TestResultApiResponse[]
}

export interface CreateUrlApiResponse {
	status: string
	message: string
	url_id?: number
}

export interface UpdateUrlApiResponse {
	status: string
	message: string
	url_id: number
}

export interface TestResultApiResponse {
	test_id: string
}

export type CreateDeployStatus = "success" | "failure"
export type DeployStatus = "pending" | "running" | "completed" | "completed, but one or more tests failed"

export interface CreateDeployApiResponse {
	status: CreateDeployStatus
	message: string
	info?: object
	deploy_id?: number
	site_id?: number
	timestamp?: number
	"tests-requested"?: number
}

export interface DeployStatusApiResponse {
	deploy_id: number
	site_id: number
	timestamp: number
	status: DeployStatus
	"tests-completed": object[]
	"tests-remaining": object[]
	note: string
	detail: string
}

export interface BudgetApiResponse {
	budget_id: number
	metric: string
	metric_full_name: string
	metric_suffix: string
	absolute_threshold: number
	relative_threshold: number
	alert_after_n_tests: number
	notifications_enabled: boolean
	status: string
	chart: ChartApiResponse
	largest_crossing: BudgetCrossingApiResponse
	crossings: BudgetCrossingApiResponse[]
}

export interface ChartApiResponse {
	chart_id: number
	title: string
	dashboard: DashboardApiResponse
}

export interface DashboardApiResponse {
	dashboard_id: number
	name: string
}

export interface BudgetCrossingApiResponse {
	status: string
	name: string
	difference_from_threshold: number
	latest_data: ChartDataApiResponse[]
}

export interface ChartDataApiResponse {
	x: number
	y: number | null
	deploy_ids: number[]
	aggregated_test_count: number
}

export interface TeamApiResponse {
	team: string
	sites: SiteApiResponse[]
	site_settings: object[]
	times: string[]
}

export const api = new ApiClient()
