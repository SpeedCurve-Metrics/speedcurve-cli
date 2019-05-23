export default function pluralise(word: string, count: number) {
  return count === 1 ? word : `${word}s`
}
