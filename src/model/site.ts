/** @module SpeedCurve */
import { SiteApiResponse } from "../api"
import Url from "./url"

/**
 * An object representing a SpeedCurve site
 */
export default class Site {
	siteId: number
	name: string
	urls: Url[]

	constructor(siteId: number, name: string, urls: Url[]) {
		this.siteId = siteId
		this.name = name
		this.urls = urls
	}

	/**
	 * Build a new {@link Site} object from a {@link https://api.speedcurve.com/#get-site-details-and-settings|/v1/sites}
	 * API response object
	 */
	static fromApiResponse(response: SiteApiResponse) {
		const site = new Site(response.site_id, response.name, response.urls.map(url => Url.fromApiResponse(url)))

		for (const url of site.urls) {
			url.site = site
		}

		return site
	}
}

module.exports = Site
