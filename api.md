All interaction with the API requires your [SpeedCurve API key](https://support.speedcurve.com/apis/synthetic-api).

## Basic usage

```js
const SpeedCurve = require('speedcurve')
const key = 'your-speedcurve-api-key'

const budgets = await SpeedCurve.budgets.getAll(key)
const deploys = await SpeedCurve.deploys.status(key, deployId)
const sites = await SpeedCurve.sites.getAll(key)
const tests = await SpeedCurve.tests.get(key, testId)
```

## Modules

### [`SpeedCurve.budgets`](modules/budgets.html)

Get the status of synthetic performance budgets.

### [`SpeedCurve.deploys`](modules/deploys.html)

Create and monitor SpeedCurve deployments (on-demand testing).

### [`SpeedCurve.sites`](modules/sites.html)

Get information about SpeedCurve sites, including recent test results.

### [`SpeedCurve.tests`](modules/tests.html)

Get synthetic test results.

### [`SpeedCurve.api`](classes/api.client.html)

Direct access to a [`Client`](classes/api.client.html) instance with functions for accessing the SpeedCurve API.
