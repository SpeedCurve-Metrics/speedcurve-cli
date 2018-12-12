#!/usr/bin/env node
const log = require("../src/log")

const config = require("yargs")
  .options({
    note: {
      describe: "Short note for this deploy",
      type: "string"
    },
    detail: {
      describe: "Longer expanded detail for this deploy",
      type: "string"
    },
    wait: {
      describe: "Wait for deploys to finish before exiting",
      type: "boolean",
      default: false
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

log.level = config.verbose ? "verbose" : config.quiet ? "error" : "warn"

try {
  const userConf = require(`${process.cwd()}/.speedcurve.json`)
  config.teams = userConf.teams
} catch (e) {
  log.error("Unable to find a valid .speedcurve.json file in the current directory.")
  process.exit(400)
}

if (!Array.isArray(config.teams) || !config.teams.length) {
  log.error(".speedcurve.json must contain an `teams` array.")
  process.exit(400)
}

const api = require("../src/api")
api.base = config.api

const speedcurve = require("../src/speedcurve")
speedcurve.deploy(config)
