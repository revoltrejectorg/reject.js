/* eslint-disable no-restricted-syntax */
/** Sets an objects getter to return placein properties
 * if not present in current object
  */
export default function propFaker(obj: any, placein: any) {
  for (const key in placein) {
    if (!Object.hasOwn(obj, key)) {
      Object.defineProperty(obj, key, {
        get: () => placein[key],
        enumerable: true,
        configurable: true,
      });
    }
  }
}
