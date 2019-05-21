const log = require("./log")
const api = require("./api")
const PerformanceBudget = require("./model/performance-budget")
const pl = require("./util/pluralise")

/**
 * Get the status of SpeedCurve performance budgets
 * @example
 * const budgets = require('speedcurve').budgets
 */
const budgets = {
  /**
   * Get all budgets in a SpeedCurve account
   *
   * @param {String} key - Your SpeedCurve API key
   * @return {Promise<Array<PerformanceBudget>, Error>}
   */
  getAll(key) {
    return api.budgets(key).then(res => res.map(data => PerformanceBudget.fromApiResponse(data)))
  },

  /**
   * Get all budgets relating to a deploy ID
   *
   * @param {String} key - Your SpeedCurve API key
   * @param {Number} deployId - A SpeedCurve deploy ID
   * @return {Promise<Array<PerformanceBudget>, Error>}
   */
  getByDeployId(key, deployId) {
    return api
      .budgets(key, deployId)
      .then(res => res.map(data => PerformanceBudget.fromApiResponse(data)))
  }
}

module.exports = budgets
