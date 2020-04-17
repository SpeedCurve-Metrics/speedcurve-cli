/**
 * Manage URLs in a SpeedCurve account
 *
 * @example
 *
 * <br>
 * <br>
 *
 * ```
 * const SpeedCurve = require("speedcurve")
 * const response = await SpeedCurve.urls.create(key, { siteId, url, label })
 * ```
 *
 * @packageDocumentation
 */

import { api, CreateUrlApiResponse, UpdateUrlApiResponse } from "./api"

interface CreateUrlOptions {
	siteId: number
	url: string
	label?: string
	script?: string
	username?: string
	password?: string
}

/**
 * Create a new URL within a site
 */
export function create(key: string, options: CreateUrlOptions): Promise<CreateUrlApiResponse> {
	return api.createUrl(key, {
		site_id: options.siteId,
		url: options.url,
		label: options.label,
	})
}

interface UpdateUrlOptions {
	url?: string
	label?: string
	script?: string
	username?: string
	password?: string
}

/**
 * Update an existing URL
 */
export function update(key: string, urlId: number, options: UpdateUrlOptions): Promise<UpdateUrlApiResponse> {
	return api.updateUrl(key, urlId, options)
}
