/* eslint-disable import/prefer-default-export */
export class Collection extends Array {
  first() {
    return this[0];
  }

  has(value: any) {
    return this[value];
  }
}
