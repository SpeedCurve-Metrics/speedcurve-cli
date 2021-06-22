import { BudgetApiResponse, BudgetCrossingApiResponse, ChartApiResponse } from "../api";

type ChartYValue = number | null;

/**
 * An object representing a SpeedCurve performance budget
 */
export default class PerformanceBudget {
  budgetId: number;
  status: string;
  metricName: string;
  absoluteThreshold: number;
  relativeThreshold: number;
  metricSuffix: string;
  chart: ChartApiResponse;
  crossings: BudgetCrossingApiResponse[];
  largestCrossing: BudgetCrossingApiResponse;

  constructor(
    budgetId: number,
    status: string,
    metricName: string,
    absoluteThreshold: number,
    relativeThreshold: number,
    metricSuffix: string
  ) {
    this.budgetId = budgetId;
    this.status = status;
    this.metricName = metricName;
    this.absoluteThreshold = absoluteThreshold;
    this.relativeThreshold = relativeThreshold;
    this.metricSuffix = metricSuffix;
    this.crossings = [];
  }

  /**
   * Get the most recent Y value from a crossing
   */
  getLatestYValue(crossing: BudgetCrossingApiResponse): ChartYValue {
    return crossing.latest_data.slice(-1).pop().y;
  }

  /**
   * Append the budget metric suffix to a value
   */
  appendMetricSuffix(value: ChartYValue): string {
    return `${value}${this.metricSuffix}`;
  }

  /**
   * Build a new {@link Budget} object from a {@link https://api.speedcurve.com/#get-performance-budgets|/v1/budgets}
   * API response object
   */
  static fromApiResponse(response: BudgetApiResponse): PerformanceBudget {
    const budget = new PerformanceBudget(
      response.budget_id,
      response.status,
      response.metric_full_name,
      response.absolute_threshold,
      response.relative_threshold,
      response.metric_suffix
    );

    budget.chart = response.chart;
    budget.crossings = response.crossings;
    budget.largestCrossing = response.largest_crossing;

    return budget;
  }
}

module.exports = PerformanceBudget;
