/* eslint-disable no-console */

const prefix = "[reject] ";
export function Log(message: string) {
  const caller = new Error().stack?.split("\n")[2]?.split(" ")[1];
  console.log(`${prefix}::${caller} ${message}`);
}

export function fixme(message: string) {
  Log(`[FIXME] ${message}`);
}

export function missingEquiv(method: string) {
  fixme(`${method} isn't implemented yet`);
}
