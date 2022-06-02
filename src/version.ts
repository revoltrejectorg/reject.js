import { readFileSync } from "fs";

export function version() {
  const pjson = JSON.parse(readFileSync("package.json", "utf8"));
  return pjson.version;
}
