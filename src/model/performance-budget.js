/**
 * @typedef {Object} BudgetApiResponse
 * @property {Number} budget_id
 * @property {String} metric
 * @property {String} metric_full_name
 * @property {String} metric_suffix
 * @property {Number} absolute_threshold
 * @property {Number} relative_threshold
 * @property {Number} alert_after_n_tests
 * @property {Boolean} notifications_enabled
 * @property {ChartApiResponse} chart
 * @property {BudgetCrossingApiResponse} largest_crossings
 * @property {Array<BudgetCrossingApiResponse>} crossings
 */

/**
 * @typedef {Object} ChartApiResponse
 * @property {Number} chart_id
 * @property {String} name
 */

/**
 * @typedef {Object} BudgetCrossingApiResponse
 * @property {String} status
 * @property {String} name
 * @property {Number} difference_from_threshold
 * @property {Array<ChartData>} latest_data
 */

/**
 * @typedef {Object} ChartData
 * @property {Number} x
 * @property {Number|null} y
 * @property {Array<Number>} deploy_ids
 * @property {Number} aggregated_test_count
 */

/**
 * An object representing a SpeedCurve performance budget
 */
class PerformanceBudget {
  /**
   * @param {Number} budgetId
   * @param {String} status
   * @param {String} metricName
   * @param {Number} absoluteThreshold
   * @param {Number} relativeThreshold
   * @param {String} metricSuffix
   */
  constructor(budgetId, status, metricName, absoluteThreshold, relativeThreshold, metricSuffix) {
    /** @type {Number} */
    this.budgetId = budgetId
    /** @type {String} */
    this.status = status
    /** @type {String} */
    this.metricName = metricName
    /** @type {Number} */
    this.absoluteThreshold = absoluteThreshold
    /** @type {Number} */
    this.relativeThreshold = relativeThreshold
    /** @type {String} */
    this.metricSuffix = metricSuffix
    /** @type {ChartApiResponse} */
    this.chart = {}
    /** @type {Array<BudgetCrossingApiResponse>} */
    this.crossings = []
    /** @type {BudgetCrossingApiResponse} */
    this.largestCrossing = {}
  }

  /**
   * Get the most recent Y value from a crossing
   * @param {BudgetCrossingApiResponse} crossing
   * @param {Boolean} appendMetricSuffix
   * @return {Number|String|null}
   */
  getLatestYValue(crossing, appendMetricSuffix = false) {
    const y = crossing.latest_data.slice(-1).pop().y

    return appendMetricSuffix ? `${y}${this.metricSuffix}` : y
  }

  /**
   * Build a new {@link Budget} object from a {@link https://api.speedcurve.com/#get-performance-budgets|/v1/budgets}
   * API response object
   * @param {BudgetApiResponse} response
   * @return {PerformanceBudget}
   */
  static fromApiResponse(response) {
    const budget = new PerformanceBudget(
      response.budget_id,
      response.status,
      response.metric_full_name,
      response.absolute_threshold,
      response.relative_threshold,
      response.metric_suffix
    )

    budget.chart = response.chart
    budget.crossings = response.crossings
    budget.largestCrossing = response.largest_crossing

    return budget
  }
}

module.exports = PerformanceBudget
