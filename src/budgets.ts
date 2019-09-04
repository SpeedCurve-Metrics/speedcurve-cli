/** @module budgets */
import { api } from "./api"
import PerformanceBudget from "./model/performance-budget"

/**
 * Get the status of SpeedCurve performance budgets
 * @example
 * const budgets = require('speedcurve').budgets
 */

/**
 * Get all budgets in a SpeedCurve account
 */
export function getAll(key: string): Promise<PerformanceBudget[]> {
	return api.budgets(key).then(res => res.map(PerformanceBudget.fromApiResponse))
}

/**
 * Get all budgets relating to a deploy ID
 */
export function getByDeployId(key: string, deployId: number): Promise<PerformanceBudget[]> {
	return api.budgetsForDeploy(key, deployId).then(res => res.map(PerformanceBudget.fromApiResponse))
}
