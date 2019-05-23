/** @module sites */
import { api } from "./api"
import Site from "./model/site"
import * as tests from "./tests"

/**
 * Retrieve information about SpeedCurve sites
 * @example
 * const sites = require('speedcurve').sites
 */

/**
 * Get the details of a SpeedCurve site
 */
export function get(key: string, siteId: number): Promise<Site> {
  return api.site(key, siteId).then(data => Site.fromApiResponse(data))
}

/**
 * Get the details of all sites in a SpeedCurve account
 */
export function getAll(key: string): Promise<Site[]> {
  return api.sites(key).then(res => res.map(data => Site.fromApiResponse(data)))
}

/**
 * Get the details of all sites in a SpeedCurve account, including recent median
 * test results.
 */
export function getAllWithTests(key: string, days: number): Promise<Site[]> {
  return getAll(key).then(async sites => {
    return Promise.all(
      sites.map(async site => {
        site.urls = await Promise.all(site.urls.map(url => tests.getForUrl(key, url.urlId, days)))

        return site
      })
    )
  })
}
