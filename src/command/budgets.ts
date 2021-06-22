import * as SpeedCurve from "../index";
import log from "../log";
import { bold } from "../util/console";

interface BudgetsCommandOptions {
  key: string;
  json: boolean;
}

export default async function budgetsCommand(opts: BudgetsCommandOptions): Promise<void> {
  const { key, json = false } = opts;
  const budgets = await SpeedCurve.budgets.getAll(key);

  if (json) {
    log.json(budgets);
  } else {
    budgets.forEach((budget) => {
      const budgetTitle = `${bold(budget.metricName)} in ${bold(budget.chart.title)}`;

      if (budget.status === "over") {
        log.bad(bold(`${budgetTitle} is ${bold("over budget")}`));
      } else {
        log.ok(bold(`${budgetTitle} is ${bold("under budget")}`));
      }

      budget.crossings.forEach((crossing) => {
        const value = budget.appendMetricSuffix(budget.getLatestYValue(crossing));
        const pctDiff = Math.round(crossing.difference_from_threshold * 100);

        log.stdout(
          `${crossing.name} is currently ${bold(value)} (${pctDiff}% ${bold(crossing.status)} ${bold("budget")})\n`
        );
      });

      log.stdout("\n");
    });
  }
}

module.exports = budgetsCommand;
