export function swap(json: any) {
  const ret: any = {};
  Object.keys(json).forEach((key) => {
    ret[json[key]] = key;
  });
  return ret;
}
