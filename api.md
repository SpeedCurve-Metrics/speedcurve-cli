All interaction with the API requires your [SpeedCurve API key](https://support.speedcurve.com/en/articles/415403-synthetic-api).

## Basic usage

```js
const SpeedCurve = require("speedcurve")
const key = "your-speedcurve-api-key"

const budgets = await SpeedCurve.budgets.getAll(key)
const deploys = await SpeedCurve.deploys.status(key, deployId)
const sites = await SpeedCurve.sites.getAll(key)
const tests = await SpeedCurve.tests.get(key, testId)
```

## Modules

### [`SpeedCurve.budgets`](modules/speedcurve_budgets.html)

Get the status of synthetic performance budgets.

### [`SpeedCurve.deploys`](modules/speedcurve_deploys.html)

Create and monitor SpeedCurve deployments (on-demand testing).

### [`SpeedCurve.sites`](modules/speedcurve_sites.html)

Get information about SpeedCurve sites, including recent test results.

### [`SpeedCurve.tests`](modules/speedcurve_tests.html)

Get synthetic test results.

### [`SpeedCurve.urls`](modules/speedcurve_urls.html)

Manage URLs within a SpeedCurve site.

### [`SpeedCurve.api`](classes/speedcurve_api.apiclient.html)

Direct access to an [`ApiClient`](classes/speedcurve_api.apiclient.html) instance with functions for accessing the SpeedCurve API.
