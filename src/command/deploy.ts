import { api } from "../api";
import * as SpeedCurve from "../index";
import { ExitCode } from "../command";
import log from "../log";
import DeployResult from "../model/deploy-result";
import PerformanceBudget from "../model/performance-budget";
import exitCodes from "../util/exit-codes";
import { bold } from "../util/console";
import pl from "../util/pluralise";
import { resolveSiteIds } from "../util/resolve-site-ids";

interface DeployCommandOptions {
  key: string;
  site?: string[] | number[];
  url?: number[];
  note?: string;
  detail?: string;
  checkBudgets?: boolean;
  wait?: boolean;
  json?: boolean;
}

type DeployJsonOutput = {
  deploys: DeployResult[];
  budgets: PerformanceBudget[];
};

type KnownLogLevel = "verbose" | "stdout" | "notice" | "bad" | "ok";

export default async function deployCommand(opts: DeployCommandOptions): Promise<ExitCode | void> {
  const { key, site = [], url = [], note = "", detail = "", checkBudgets = false, wait = false, json = false } = opts;

  // Used to record any errors during the deploy process
  let exitCode = 0;

  const noJsonLog = (level: KnownLogLevel, message: string) => {
    if (!json) {
      log[level](message);
    }
  };

  if (url.length) {
    noJsonLog("verbose", `Requesting deploys for ${url.length || "all"} ${pl("URL", url.length)}...`);
  } else {
    noJsonLog("verbose", `Requesting deploys for ${site.length || "all"} ${pl("site", site.length)}...`);
  }

  const budgetsBeforeDeploy: Map<number, PerformanceBudget> = new Map();

  if (checkBudgets) {
    noJsonLog("verbose", "Determining initial status of performance budgets...\n");

    await SpeedCurve.budgets.getAll(key).then((budgets) => {
      budgets.forEach((b) => budgetsBeforeDeploy.set(b.budgetId, b));
    });
  }

  let results: DeployResult[] = [];

  if (url.length) {
    results = await SpeedCurve.deploys.createForUrls(key, url, { note, detail });
  } else {
    const siteIds = await resolveSiteIds(key, site);
    results = await SpeedCurve.deploys.create(key, siteIds, { note, detail });
  }

  const successfulResults = results.filter((result) => result.success);

  if (successfulResults.length !== results.length) {
    exitCode = exitCodes.DEPLOY_FAILED;
  }

  successfulResults.forEach((result) => {
    if (result.url) {
      noJsonLog(
        "ok",
        `Deploy ${result.deployId} triggered ${result.totalTests} ${pl("test", result.totalTests)} for ${
          result.site.name
        } / ${result.url.label}`
      );
    } else {
      noJsonLog(
        "ok",
        `Deploy ${result.deployId} triggered ${result.totalTests} ${pl("test", result.totalTests)} for ${
          result.site.name
        }`
      );
    }
  });

  const jsonOut: DeployJsonOutput = { deploys: results, budgets: [] };

  if (successfulResults.length && (wait || checkBudgets)) {
    noJsonLog("stdout", "Waiting for all tests to complete...");

    const totalTests = DeployResult.countTests(successfulResults);

    const updateDeployStatus = async () => {
      const ps = successfulResults.map((result) =>
        api
          .deployStatus(key, result.deployId)
          .then((res) => {
            result.updateFromApiResponse(res);
          })
          .catch((err) => {
            noJsonLog("notice", `Couldn't retrieve deploy status for site ${result.site.name}: ${err.message}`);
          })
      );

      await Promise.all(ps);

      const completedTests = DeployResult.countCompletedTests(successfulResults);
      const pctCompleted = Math.round((completedTests / totalTests) * 100);

      noJsonLog("stdout", `\rWaiting for tests to complete... ${completedTests} / ${totalTests} (${pctCompleted}%)`);

      if (completedTests < totalTests) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(updateDeployStatus());
          }, 5000);
        });
      }

      return Promise.resolve();
    };

    const maybeCheckBudgets = async () => {
      if (!checkBudgets) {
        return;
      }

      noJsonLog("stdout", "Checking status of performance budgets...\n\n");

      const budgetsAfterDeploy: Map<number, PerformanceBudget> = new Map();

      jsonOut.budgets = Array.from(budgetsAfterDeploy.values());

      await Promise.all(
        successfulResults.map((result) =>
          SpeedCurve.budgets.getByDeployId(key, result.deployId).then((budgets) => {
            budgets.forEach((b) => budgetsAfterDeploy.set(b.budgetId, b));
          })
        )
      );

      budgetsAfterDeploy.forEach((budget) => {
        const prevBudget = budgetsBeforeDeploy.get(budget.budgetId);
        const statusChanged = prevBudget.status !== budget.status;
        const stillOver = prevBudget.status === "over" && budget.status === "over";

        // We can't rely on the crossings being in a consistent order, so we
        // reference them by name instead.
        const prevCrossings = new Map();

        prevBudget.crossings.forEach((crossing) => {
          prevCrossings.set(crossing.name, crossing);
        });

        const budgetTitle = `${bold(budget.metricName)} in ${bold(budget.chart.title)}`;

        if (stillOver) {
          noJsonLog("bad", bold(`${budgetTitle} is ${bold("still over budget")}`));
        } else if (statusChanged) {
          if (budget.status === "over") {
            noJsonLog("bad", bold(`${budgetTitle} has ${bold("gone over budget")}`));
          } else {
            noJsonLog("ok", bold(`${budgetTitle} has ${bold("gone under budget")}`));
          }
        } else {
          noJsonLog("ok", bold(`${budgetTitle} is ${bold("still under budget")}`));
        }

        budget.crossings.forEach((crossing) => {
          const prevCrossing = prevCrossings.get(crossing.name);
          const prevValue = budget.appendMetricSuffix(budget.getLatestYValue(prevCrossing));
          const newValue = budget.appendMetricSuffix(budget.getLatestYValue(crossing));
          const pctDiff = Math.round(crossing.difference_from_threshold * 100);

          noJsonLog(
            "stdout",
            `${crossing.name} ${bold(prevValue)} => ${bold(newValue)} (${pctDiff}% ${crossing.status} budget)\n`
          );
        });

        noJsonLog("stdout", "\n");
      });

      const anyBudgetsOver = [...budgetsAfterDeploy.values()].some((budget) => budget.status === "over");

      if (anyBudgetsOver) {
        exitCode = exitCodes.DEPLOY_OVER_BUDGET;
      }
    };

    return updateDeployStatus()
      .then(() => {
        noJsonLog("stdout", "\n");
        noJsonLog("ok", "All tests completed");
      })
      .then(maybeCheckBudgets)
      .then(() => {
        if (json) {
          log.json(jsonOut);
        }

        return exitCode;
      });
  } else {
    if (json) {
      log.json(jsonOut);
    }
  }

  return exitCode;
}
