export type ExitCode = number;
export type Command = (opts: any) => Promise<void | ExitCode>; // eslint-disable-line @typescript-eslint/no-explicit-any
