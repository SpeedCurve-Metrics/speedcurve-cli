# SpeedCurve Deploy

Define and run SpeedCurve tests from the command line. With speedcurve-deploy, you use a `.speedcurve.json` file to configure the tests that you want to run. Then, using a single command, you run the tests on-demand and optionally wait to receive results.

## Installation

SpeedCurve Deploy requires [Node.js](https://nodejs.org/) version 8 or higher. It can be installed by running:

```
npm install -g speedcurve-deploy
```

## Basic usage

Run `speedcurve-deploy` in a directory containing a `.speedcurve.json` file to run SpeedCurve tests:

```
speedcurve-deploy --note 'v2.11.8' --detail 'Inline critical CSS, bootstrap app on DOMContentLoaded'
```

> 💁 The `--note` (a short description of the deploy) and `--detail` (longer details of the deploy) flags are both optional but are recommended to help you identify deploys in the SpeedCurve UI.

You can also pass the `--wait` flag to force the process to wait until all tests have been completed:

```
speedcurve-deploy --note 'v2.11.8' --wait
OK [News Sites] Triggered 24 tests for BBC News
OK [News Sites] Triggered 24 tests for The Guardian
OK [News Sites] Triggered 6 tests for Stuff
OK [News Sites] Triggered 6 tests for NZ Herald
OK [News Sites] Triggered 6 tests for Radio NZ
Waiting for all tests to complete... 66 / 66 (100%)
OK All tests completed
```

## Configuration

SpeedCurve Deploy is configured with a `.speedcurve.json` file, which looks like this:

```json
{
  "teams": [
    {
      "key": "******",
      "sites": [41774, 70313, 70315]
    },
    {
      "key": "******"
    }
  ]
}
```

The root object has an `teams` property which is an array of teams objects, each representing a SpeedCurve teams. See below for a description of the teams object properties.

| Property | Description | Default |
|----------|------------------------------------------------------|-----------------------|
| `key`    | _Required._ [API key][api-docs] for the team.        | Not set               |
| `sites`  | _Optional._ Array of site IDs to trigger tests for.  | All sites in the team |

[api-docs]: https://support.speedcurve.com/apis/synthetic-api
