# SpeedCurve CLI

🍩 Official SpeedCurve CLI and Node.js API.

## Installation

The recommended installation method is via npm:

```
npm install -g speedcurve
```

Note that this requires [Node.js](https://nodejs.org/) version 8 or higher.

## Basic usage

The `speedcurve` CLI interacts with the SpeedCurve API using your [SpeedCurve API key](https://support.speedcurve.com/apis/synthetic-api). This key can either be set as the `SPEEDCURVE_API_KEY` environment variable, e.g. `SPEEDCURVE_API_KEY=xxx speedcurve deploy` or can be specified using the `--key` flag e.g. `speedcurve deploy --key=xxx`.

See `speedcurve --help` for a list of all commands and options.

## Available commands

### `speedcurve deploy`

Create a deploy and trigger testing for one or more sites.

```
speedcurve deploy --note 'v2.11.8' --detail 'Inline critical CSS, bootstrap app on DOMContentLoaded'
```

> 💁 The `--note` (a short description of the deploy) and `--detail` (longer details of the deploy) flags are both optional but are recommended to help you identify deploys in the SpeedCurve UI.

#### The `--site` option

You can specify which sites to trigger deploys for with the `--site` option. Specify as many sites as you like.

```
speedcurve deploy --note 'v2.11.8' --site 1043801 --site 1029909
```

#### The `--wait` option

You can also pass the `--wait` flag to force the process to wait until all tests have been completed:

```
speedcurve deploy --note 'v2.11.8' --wait
OK [News Sites] Triggered 24 tests for BBC News
OK [News Sites] Triggered 24 tests for The Guardian
OK [News Sites] Triggered 6 tests for Stuff
OK [News Sites] Triggered 6 tests for NZ Herald
OK [News Sites] Triggered 6 tests for Radio NZ
Waiting for all tests to complete... 66 / 66 (100%)
OK All tests completed
```

### `speedcurve list-sites`

List all of the sites in a team.

```
speedcurve list-sites --json
```

## Node.js API documentation

See [the API reference](https://speedcurve-metrics.github.io/speedcurve-cli/).
