/**
 * Provides direct access to the SpeedCurve REST API client. See {@link ApiClient} for usage information.
 *
 * @module
 * @example
 *
 * ```
 * import SpeedCurve from "speedcurve";
 *
 * const api = SpeedCurve.api;
 * ```
 */
import * as r from "request-promise";
import { URL } from "url";
import log from "./log";
import truncate from "./util/truncate";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const VERSION = require("../package.json").version;

const logFriendlyUrl = (url: URL) => {
  const hasSearchParams = [...url.searchParams.values()].length > 0;

  return [url.origin, url.pathname, hasSearchParams ? "?" + url.searchParams : ""].join("");
};

export class ApiClient {
  base: string;

  constructor() {
    this.base = "https://api.speedcurve.com/";
  }

  prepareUrl(key: string, path: string, searchParams: { [key: string]: string } = {}): URL {
    const url = new URL(path, this.base);

    url.username = key;
    url.password = "x";

    const preparedSearchParams = this.prepareData(searchParams);

    for (const key in preparedSearchParams) {
      url.searchParams.set(key, preparedSearchParams[key]);
    }

    return url;
  }

  /**
   * Transform a plain JS object into an API-compatible object
   */
  prepareData(data: Record<string, unknown>): Record<string, string> {
    const formData: Record<string, string> = {};

    for (const key in data) {
      if (typeof data[key] === "boolean") {
        // Boolean values are sent as "1" or "0"
        formData[key] = data[key] ? "1" : "0";
      } else if (typeof data[key] !== "undefined") {
        // Undefined/unset values are excluded
        formData[key] = data[key].toString();
      }
    }

    return formData;
  }

  // The V1 SpeedCurve API does not have consistent error reporting. This
  // method attempts to normalise errors to be of type { message: string }
  normaliseError(e: ApiError): Error {
    if (typeof (e as ApiErrorString) === "string") {
      // API returns a string
      return new Error(e as ApiErrorString);
    }

    if (typeof (e as ApiErrorObjectWithErrorKey).error === "string") {
      // API returns an { error: string } object
      return new Error((e as ApiErrorObjectWithErrorKey).error);
    }
    if (typeof (e as ApiErrorObjectWithMessageKey).message === "string") {
      // API returns an { message: string } object
      return new Error((e as ApiErrorObjectWithMessageKey).message);
    }

    return new Error(`An unknown error was received from the API: ${JSON.stringify(e)}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(url: URL): Promise<any> {
    log.http("GET", logFriendlyUrl(url));

    return r
      .get({
        uri: url.href,
        json: true,
        headers: {
          "user-agent": `speedcurve-cli/${VERSION}`,
        },
      })
      .catch((res) => {
        throw this.normaliseError(res.error);
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post(url: URL, data = {}): Promise<any> {
    const formData = this.prepareData(data);

    log.http("POST", `${logFriendlyUrl(url)} ${truncate(JSON.stringify(formData), 100)}`);

    return r
      .post({
        uri: url.href,
        json: true,
        form: formData,
        headers: {
          "user-agent": `speedcurve-cli/${VERSION}`,
        },
      })
      .catch((err) => {
        throw this.normaliseError(err);
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put(url: URL, data = {}): Promise<any> {
    const formData = this.prepareData(data);

    log.http("PUT", `${logFriendlyUrl(url)} ${truncate(JSON.stringify(formData), 100)}`);

    return r
      .put({
        uri: url.href,
        json: true,
        form: formData,
        headers: {
          "user-agent": `speedcurve-cli/${VERSION}`,
        },
      })
      .catch((err) => {
        throw this.normaliseError(err);
      });
  }

  deploy(key: string, settings: DeployEndpointParameters): Promise<CreateDeployApiResponse> {
    const url = this.prepareUrl(key, `/v1/deploys`);

    return this.post(url, settings).then((res) => res);
  }

  deployStatus(key: string, deployId: number): Promise<DeployStatusApiResponse> {
    const url = this.prepareUrl(key, `/v1/deploys/${deployId}`);

    return this.get(url).then((res) => res);
  }

  team(key: string): Promise<TeamApiResponse> {
    const url = this.prepareUrl(key, "/v1/export");

    return this.get(url).then((res) => res.teams[0]);
  }

  site(key: string, siteId: number): Promise<SiteApiResponse> {
    const url = this.prepareUrl(key, `/v1/sites/${siteId}`);

    return this.get(url).then((res) => res.site);
  }

  sites(key: string): Promise<SiteApiResponse[]> {
    const url = this.prepareUrl(key, "/v1/sites");

    return this.get(url).then((res) => res.sites);
  }

  createUrl(key: string, settings: CreateUrlEndpointParameters): Promise<CreateUrlApiResponse> {
    const url = this.prepareUrl(key, "/v1/urls");

    return this.post(url, settings).then((res) => res);
  }

  updateUrl(key: string, urlId: number, settings: UpdateUrlEndpointParameters): Promise<UpdateUrlApiResponse> {
    const url = this.prepareUrl(key, `/v1/urls/${urlId}`);

    return this.put(url, settings).then((res) => res);
  }

  test(key: string, testId: string): Promise<TestResultApiResponse> {
    const url = this.prepareUrl(key, `/v1/tests/${testId}`);

    return this.get(url).then((res) => res);
  }

  tests(key: string, urlId: number, days = 1, filters: TestFilters = {}): Promise<UrlApiResponse> {
    const { region, browser } = filters;
    const url = this.prepareUrl(key, `/v1/urls/${urlId}`, { days: `${days}`, region, browser });

    return this.get(url).then((res) => res);
  }

  budgets(key: string): Promise<BudgetApiResponse[]> {
    const url = this.prepareUrl(key, "/v1/budgets");

    return this.get(url).then((res) => res.budgets);
  }

  budgetsForDeploy(key: string, deployId: number): Promise<BudgetApiResponse[]> {
    const url = this.prepareUrl(key, "/v1/budgets", { deploy_id: `${deployId}` });

    return this.get(url).then((res) => res.budgets);
  }
}

type ApiErrorString = string;

interface ApiErrorObjectWithErrorKey {
  error: string;
}

interface ApiErrorObjectWithMessageKey {
  message: string;
}

type ApiError = ApiErrorString | ApiErrorObjectWithErrorKey | ApiErrorObjectWithMessageKey;

export interface TestFilters {
  region?: string;
  browser?: string;
}

interface BaseDeployEndpointParameters {
  note?: string;
  detail?: string;
  force?: boolean;
}

interface UrlDeployEndpointParameters extends BaseDeployEndpointParameters {
  url_id: number;
}

interface SiteDeployEndpointParameters extends BaseDeployEndpointParameters {
  site_id: number;
}

interface CreateUrlEndpointParameters {
  site_id: number;
  url: string;
  label?: string;
  script?: string;
  username?: string;
  password?: string;
}

interface UpdateUrlEndpointParameters {
  url?: string;
  label?: string;
  script?: string;
  username?: string;
  password?: string;
}

export type DeployEndpointParameters = UrlDeployEndpointParameters | SiteDeployEndpointParameters;

export interface SiteApiResponse {
  site_id: number;
  name: string;
  urls: UrlApiResponse[];
}

export interface UrlApiResponse {
  url_id: number;
  label: string;
  url: string;
  tests?: TestResultApiResponse[];
}

export interface CreateUrlApiResponse {
  status: string;
  message: string;
  url_id?: number;
}

export interface UpdateUrlApiResponse {
  status: string;
  message: string;
  url_id: number;
}

export interface TestResultApiResponse {
  test_id: string;
}

export type CreateDeployStatus = "success" | "failure";
export type DeployStatus = "pending" | "running" | "completed" | "completed, but one or more tests failed";

export interface CreateDeployApiResponse {
  status: CreateDeployStatus;
  message: string;
  info?: Record<string, unknown>;
  deploy_id?: number;
  site_id?: number;
  timestamp?: number;
  "tests-requested"?: number;
}

export interface DeployStatusApiResponse {
  deploy_id: number;
  site_id: number;
  timestamp: number;
  status: DeployStatus;
  "tests-completed": Record<string, unknown>[];
  "tests-remaining": Record<string, unknown>[];
  note: string;
  detail: string;
}

export interface BudgetApiResponse {
  budget_id: number;
  metric: string;
  metric_full_name: string;
  metric_suffix: string;
  absolute_threshold: number;
  relative_threshold: number;
  alert_after_n_tests: number;
  notifications_enabled: boolean;
  status: string;
  chart: ChartApiResponse;
  largest_crossing: BudgetCrossingApiResponse;
  crossings: BudgetCrossingApiResponse[];
}

export interface ChartApiResponse {
  chart_id: number;
  title: string;
  dashboard: DashboardApiResponse;
}

export interface DashboardApiResponse {
  dashboard_id: number;
  name: string;
}

export interface BudgetCrossingApiResponse {
  status: string;
  name: string;
  difference_from_threshold: number;
  latest_data: ChartDataApiResponse[];
}

export interface ChartDataApiResponse {
  x: number;
  y: number | null;
  deploy_ids: number[];
  aggregated_test_count: number;
}

export interface TeamApiResponse {
  team: string;
  sites: SiteApiResponse[];
  site_settings: Record<string, unknown>[];
  times: string[];
}

export const api = new ApiClient();
