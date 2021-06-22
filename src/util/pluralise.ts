export default function pluralise(word: string, count: number): string {
  return count === 1 ? word : `${word}s`;
}
