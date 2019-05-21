module.exports.bold = function boldText(str) {
  return `\x1b[1m${str}\x1b[0m`
}
