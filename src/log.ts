import npmlog = require("npmlog")
import { MessageObject } from "npmlog"

class Logger {
  setLevel(level: string) {
    npmlog.level = level
  }

  json(value: any) {
    this.stdout(JSON.stringify(value))
  }

  stdout(message: string) {
    npmlog.stdout("", message)
  }

  verbose(message: string) {
    npmlog.verbose("", message)
  }

  http(prefix: string, message: string) {
    npmlog.http(prefix, message)
  }

  ok(message: string) {
    npmlog.ok("", message)
  }

  bad(message: string) {
    npmlog.bad("", message)
  }

  notice(message: string) {
    npmlog.notice("", message)
  }

  warn(message: string) {
    npmlog.warn("", message)
  }

  error(message: string) {
    npmlog.error("", message)
  }
}

const logger = new Logger()

npmlog.level = "silent"
npmlog.prefixStyle = {}
npmlog.addLevel("ok", 5000, { fg: "green" }, "✔")
npmlog.addLevel("bad", 5000, { fg: "red" }, "✖")

// In the interests of using a single interface for writing output, this sets up
// a "stdout" log level which is never written to stderr by npmlog but is instead
// handled here and passed directly to process.stdout
npmlog.addLevel("stdout", Infinity, { fg: "green" })
npmlog.on("log.stdout", (log: MessageObject) => {
  process.stdout.write(log.prefix + log.message)
})

export default logger
module.exports = logger
