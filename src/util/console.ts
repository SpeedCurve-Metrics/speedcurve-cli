export function bold(str: string | number) {
	return `\x1b[1m${str}\x1b[0m`
}
