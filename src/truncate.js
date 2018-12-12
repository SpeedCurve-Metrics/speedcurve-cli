module.exports = function truncate(str, length) {
  const sliced = str.slice(0, length)

  if (sliced.length < str.length + 3) {
    return sliced + "..."
  }

  return str
}
