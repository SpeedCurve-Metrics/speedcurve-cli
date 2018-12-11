#!/usr/bin/env node
const log = require('npmlog')

const config = require('yargs').options({
  'api': {
    coerce: (str) => {
      try {
        return new URL(str).toString()
      } catch (e) {
        log.error('Invalid URL supplied to --api')
        process.exit(400)
      }
    },
    default: 'https://api.speedcurve.com/',
    describe: 'Set the SpeedCurve API endpoint'
  },
  'note': {
    describe: 'Short note for this deploy'
  },
  'note-detail': {
    describe: 'Longer expanded detail for this deploy'
  },
  'verbose': {
    alias: 'v',
    describe: 'Show verbose output',
    type: 'boolean'
  }
}).argv

log.level = config.verbose ? 'verbose' : 'error'

try {
  const userConf = require(`${process.cwd()}/.speedcurve.json`)
  config.accounts = userConf.accounts
} catch (e) {
  log.error('Unable to find a valid .speedcurve.json file in the current directory.')
  process.exit(400)
}

if (!Array.isArray(config.accounts) || !config.accounts.length) {
  log.error('.speedcurve.json must contain an `accounts` array.')
  process.exit(400)
}

const api = require('../src/api')
api.base = config.api

const speedcurve = require('../src/speedcurve')
speedcurve.deploy(config)
