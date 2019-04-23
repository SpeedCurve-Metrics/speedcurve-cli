# SpeedCurve CLI

🍩 Official SpeedCurve CLI and Node.js API.

## Current features

**This package is in beta** and provides a limited set of features:

* Trigger deploys
* Monitor the status of deploys
* Fetch synthetic test data
* List sites in an account

## Planned features

* Fetch data from custom charts
* Integration with performance budget alerts (e.g. fail the build when a budget is crossed)

## Installation

The recommended installation method for the CLI is via npm:

```
npm install -g speedcurve
```

To use the Node.js API you should install it as a dependency of your project:

```
npm install --save speedcurve
```

> Note that [Node.js](https://nodejs.org/) version 8 or higher is required.

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

You can also specify a site name instead of an ID if you prefer:

```
speedcurve deploy --note 'v2.11.8' --site 1043801 --site 'BBC News'
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

List all of the sites in a team. Useful for finding the ID of a site to deploy.

```
speedcurve list-sites --json
```

### `speedcurve tests`

Fetch synthetic test results for a site and all of its URLs.

```
speedcurve tests --site 1043801
```

You can limit the results to specific URLs.

```
speedcurve tests --site 1043801 --url 184629 --url 78211
```

Like the `deploy` command, you can use site and URL names instead of IDs:

```
speedcurve tests --site 'BBC News' --url 'Home' --url 'Article'
```

Other options allow you to fetch more than 1 day of tests, and limit the results to specific regions or browsers:

```
speedcurve tests --site 'BBC News' --days 7 --region ap-southeast-2 --browser chrome
```

## Node.js API documentation

See [the API reference](https://speedcurve-metrics.github.io/speedcurve-cli/).

## Contributing

This tool is still in beta, but pull requests are welcome! Please read [CONTRIBUTING.md](.github/CONTRIBUTING.md) first.
