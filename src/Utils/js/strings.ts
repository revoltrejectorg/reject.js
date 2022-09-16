export function replaceAll(original: string, str: string | RegExp, newStr: any) {
  // If a regex pattern
  if (Object.prototype.toString.call(str).toLowerCase() === "[object regexp]") {
    return original.replace(str, newStr);
  }

  // If a string
  return original.replace(new RegExp(str, "g"), newStr);
}
