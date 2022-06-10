/**
 * Checks if a string is longer than the discord character limit.
 * @param str - the string to check
 * @returns true if the string fits in the discord character limit
 */
export function charLimitChecker(str: string) {
  const charLimit = 2000;
  return str.length <= charLimit;
}

export function trimIfLong(str: string) {
  if (charLimitChecker(str)) return str;
  return str.slice(0, 2000);
}
