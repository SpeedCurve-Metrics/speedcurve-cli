module.exports = function pluralise(word, count) {
  return count === 1 ? word : `${word}s`
}
