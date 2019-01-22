#!/usr/bin/env node
const yargs = require("yargs")
const log = require("../src/log")
const api = require("../src/api")

const opts = yargs
  .command("deploy", "Create a deploy and trigger testing for one or more sites", {
    note: {
      describe: "Short note for this deploy",
      type: "string"
    },
    detail: {
      describe: "Longer expanded detail for this deploy",
      type: "string"
    },
    site: {
      describe: "Only trigger deploys for the specified site ID(s)",
      type: "array",
      default: []
    },
    wait: {
      describe: "Wait for deploys to finish before exiting",
      type: "boolean",
      default: false
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
      describe:
        "SpeedCurve API key. Can also be specified in the SPEEDCURVE_API_KEY environment variable"
    },
    api: {
      coerce: str => {
        try {
          return new URL(str).toString()
        } catch (e) {
          log.error("Invalid URL supplied to --api")
          process.exit(400)
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
log.level = opts.verbose ? "verbose" : opts.quiet ? "error" : "warn"
opts.key = opts.key ? opts.key : process.env.SPEEDCURVE_API_KEY

if (!opts.key) {
  log.error(
    `No API key was given. Please specify an API key in the SPEEDCURVE_API_KEY environment variable.`
  )
  process.exit(400)
}

if (!opts._.length) {
  yargs.showHelp()
  process.exit(400)
}

const command = (() => {
  switch (opts._[0]) {
    case "deploy":
      return require("../src/command/deploy")
    case "list-sites":
      return require("../src/command/list-sites")
    default:
      return yargs.showHelp
  }
})()

try {
  command(opts)
} catch (e) {
  log.error(e)
  process.exit(500)
}
