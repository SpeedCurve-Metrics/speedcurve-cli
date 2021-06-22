export function bold(str: string | number): string {
  return `\x1b[1m${str}\x1b[0m`;
}
