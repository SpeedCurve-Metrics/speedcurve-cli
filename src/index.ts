import { api } from "./api";
import * as budgets from "./budgets";
import * as deploys from "./deploys";
import DeployResult from "./model/deploy-result";
import PerformanceBudget from "./model/performance-budget";
import Site from "./model/site";
import TestResult from "./model/test-result";
import Url from "./model/url";
import * as sites from "./sites";
import * as tests from "./tests";
import * as urls from "./urls";

/**
 * @module SpeedCurve
 */
export { api, budgets, deploys, sites, urls, tests, DeployResult, PerformanceBudget, Site, TestResult, Url };
