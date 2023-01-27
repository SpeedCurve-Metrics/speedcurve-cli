/**
 * Retrieve synthetic test results
 *
 * @module
 * @example
 *
 * ```
 * const SpeedCurve = require("speedcurve")
 * const tests = await SpeedCurve.tests.get(key, testId)
 * ```
 *
 * @packageDocumentation
 */

import { api } from "./api";
import { TestFilters } from "./api";
import TestResult from "./model/test-result";
import Url from "./model/url";

/**
 * Get the details of an individual test
 */
export function get(key: string, testId: string): Promise<TestResult> {
  return api.test(key, testId).then(TestResult.fromApiResponse);
}

/**
 * Get synthetic test results for a SpeedCurve URL
 */
export function getForUrl(key: string, urlId: number, days = 1, filters: TestFilters = {}): Promise<Url> {
  return api.tests(key, urlId, days, filters).then(Url.fromApiResponse);
}
