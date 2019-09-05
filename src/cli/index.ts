#!/usr/bin/env node
import yargs from "yargs"
import { URL } from "url"
import { api } from "../api"
import { Command } from "../command"
import budgetsCommand from "../command/budgets"
import deployCommand from "../command/deploy"
import deployStatusCommand from "../command/deploy-status"
import listSitesCommand from "../command/list-sites"
import testsCommand from "../command/tests"
import log from "../log"

log.setLevel("error")

const opts = yargs
	.command("deploy", "Create a deploy and trigger testing for one or more sites", {
		note: {
			group: "Deploy options:",
			describe: "Short note for this deploy",
			type: "string"
		},
		detail: {
			group: "Deploy options:",
			describe: "Longer expanded detail for this deploy",
			type: "string"
		},
		site: {
			group: "Deploy options:",
			conflicts: "url",
			describe: "Only trigger deploys for the specified site ID(s) or name(s)",
			type: "array"
		},
		url: {
			group: "Deploy options:",
			conflicts: "site",
			describe: "Only trigger deploys for the specified URL ID(s)",
			type: "array"
		},
		"check-budgets": {
			group: "Deploy options:",
			describe: "Check the status of relevant performance budgets after the deploy is finished",
			type: "boolean",
			default: false
		},
		wait: {
			group: "Deploy options:",
			describe: "Wait for deploys to finish before exiting",
			type: "boolean",
			default: false
		}
	})
	.command("deploy-status <deployId>", "Get the status of a deploy", {
		json: {
			describe: "Display results as JSON",
			type: "boolean",
			default: false
		}
	})
	.command("budgets", "Get the status of all performance budgets in an account", {
		json: {
			describe: "Display results as JSON",
			type: "boolean",
			default: false
		}
	})
	.command("tests", "Get the latest synthetic test data for one or more URLs in a site", {
		site: {
			describe: "Get test data for the specified site ID or name",
			type: "string",
			demandOption: true
		},
		url: {
			describe: "Only get test data for the specific URL ID(s) or name(s)",
			type: "array",
			default: []
		},
		days: {
			describe: "How many days worth of test data to get",
			type: "number",
			default: 1
		},
		region: {
			describe: "Only get tests from the specified region",
			type: "string"
		},
		browser: {
			describe: "Only get tests from the specified browser",
			type: "string"
		}
	})
	.command("list-sites", "List all of the sites in an account", {
		json: {
			describe: "Display results as JSON",
			type: "boolean",
			default: false
		}
	})
	.options({
		key: {
			describe: "SpeedCurve API key. Can also be specified in the SPEEDCURVE_API_KEY environment variable"
		},
		api: {
			coerce: str => {
				try {
					return new URL(str).toString()
				} catch (e) {
					log.error(`Invalid URL "${str}" supplied to --api`)
					return process.exit(400)
				}
			},
			default: "https://api.speedcurve.com/",
			describe: "Set the SpeedCurve API endpoint",
			hidden: true
		},
		quiet: {
			describe: "Quiet mode. Only report errors",
			type: "boolean"
		},
		verbose: {
			alias: "v",
			describe: "Show verbose output",
			type: "boolean"
		}
	})
	.help()
	.version().argv

api.base = opts.api
log.setLevel(opts.verbose ? "verbose" : opts.quiet ? "error" : "warn")
opts.key = opts.key ? opts.key : process.env.SPEEDCURVE_API_KEY

if (!opts.key) {
	log.error(`No API key was given. Please specify an API key in the SPEEDCURVE_API_KEY environment variable.`)
	process.exit(400)
}

if (!opts._.length) {
	yargs.showHelp()
	process.exit(400)
}

const command: Command = (() => {
	switch (opts._[0]) {
		case "deploy":
			return deployCommand
		case "deploy-status":
			return deployStatusCommand
		case "budgets":
			return budgetsCommand
		case "tests":
			return testsCommand
		case "list-sites":
			return listSitesCommand
		default:
			return () => {
				yargs.showHelp()
				return Promise.resolve(400)
			}
	}
})()

command(opts)
	.then(ret => {
		if (typeof ret === "number") {
			process.exit(ret)
		}

		process.exit(0)
	})
	.catch((e: Error) => {
		log.error(e.message)

		if (["TypeError", "ReferenceError"].includes(e.name)) {
			log.stdout(
				"\nPlease report this error along with the following details at https://github.com/SpeedCurve-Metrics/speedcurve-cli/issues/new\n"
			)
			console.log(e) // eslint-disable-line no-console
		}

		process.exit(500)
	})
