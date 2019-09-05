/** @module SpeedCurve */
import { UrlApiResponse } from "../api"
import Site from "./site"
import TestResult from "./test-result"

/**
 * An object representing a URL within a SpeedCurve site
 */
export default class Url {
	urlId: number
	label: string
	url: string
	site: Site
	tests: TestResult[]

	constructor(urlId: number, label: string, url: string, tests: TestResult[] = []) {
		this.urlId = urlId
		this.label = label
		this.url = url
		this.tests = tests
	}

	toString() {
		if (this.site) {
			return `URL ${this.urlId} (${this.site.name} / ${this.label})`
		}

		return `URL ${this.urlId} (${this.label})`
	}

	/**
	 * Build a new {@link Url} object from a {@link https://api.speedcurve.com/#get-all-urls|/v1/urls}
	 * API response object
	 */
	static fromApiResponse(response: UrlApiResponse) {
		return new Url(
			response.url_id,
			response.label,
			response.url,
			response.tests ? response.tests.map(test => TestResult.fromApiResponse(test)) : []
		)
	}
}
