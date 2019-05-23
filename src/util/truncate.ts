export default function truncate(str: string, length: number) {
  const sliced = str.slice(0, length)

  if (sliced.length + 3 < str.length) {
    return sliced + "..."
  }

  return str
}
