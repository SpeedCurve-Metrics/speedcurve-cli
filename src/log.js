const log = require("npmlog")

log.level = "silent"
log.prefixStyle = {}
log.addLevel("ok", 5000, { fg: "green", bg: "black" }, "OK")

// In the interests of using a single interface for writing output, this sets up
// a "stdout" log level which is never written to stderr by npmlog but is instead
// handled here and passed directly to process.stdout
log.addLevel("stdout", Infinity, { fg: "green", bg: "black" })
log.on("log.stdout", log => {
  process.stdout.write(log.prefix + log.message)
})

module.exports = log
