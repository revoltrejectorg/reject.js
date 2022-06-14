export class Collection<K, V> extends Map<K, V> {
  at(index: number) {
    const i = Math.floor(index);
    const arr = [...this.values()];

    return arr.at(i);
  }

  first(amount?: number): V | V[] | undefined {
    if (typeof amount === "undefined") return this.values().next().value;
    if (amount < 0) return this.last(amount * -1);
    const amountToGet = Math.min(this.size, amount);
    const iter = this.values();

    return Array.from({ length: amountToGet }, (): V => iter.next().value);
  }

  firstKey(amount?: number): K | K[] | undefined {
    if (typeof amount === "undefined") return this.keys().next().value;
    if (amount < 0) return this.lastKey(amount * -1);
    const len = Math.min(this.size, amount);
    const iter = this.keys();

    return Array.from({ length: len }, (): K => iter.next().value);
  }

  ensure(key: K, defaultValueGenerator: (k: K, collection: this) => V): V {
    if (this.has(key)) return this.get(key)!;
    const defaultValue = defaultValueGenerator(key, this);
    this.set(key, defaultValue);
    return defaultValue;
  }

  hasAll(...keys: K[]) {
    return keys.every((key) => super.has(key));
  }

  hasAny(...keys: K[]) {
    return keys.some((k) => super.has(k));
  }

  last(amount?: number): V | V[] | undefined {
    const arr = [...this.values()];
    if (typeof amount === "undefined") return arr[arr.length - 1];
    if (amount < 0) return this.first(amount * -1);
    if (!amount) return [];

    return arr.slice(-amount);
  }

  lastKey(amount?: number): K | K[] | undefined {
    const arr = [...this.keys()];
    if (typeof amount === "undefined") return arr[arr.length - 1];
    if (amount < 0) return this.firstKey(amount * -1);
    if (!amount) return [];

    return arr.slice(-amount);
  }

  keyAt(index: number) {
    const i = Math.floor(index);
    const arr = [...this.keys()];
    return arr.at(i);
  }

  random(amount?: number): V | V[] | undefined {
    const arr = [...this.values()];
    if (typeof amount === "undefined") return arr[Math.floor(Math.random() * arr.length)];
    if (!arr.length || !amount) return [];

    return Array.from(
      { length: Math.min(amount, arr.length) },
      (): V => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]!,
    );
  }

  randomKey(amount?: number): K | K[] | undefined {
    const arr = [...this.keys()];
    if (typeof amount === "undefined") return arr[Math.floor(Math.random() * arr.length)];
    if (!arr.length || !amount) return [];

    return Array.from(
      { length: Math.min(amount, arr.length) },
      (): K => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]!,
    );
  }

  reverse() {
    const entries = [...this.entries()].reverse();
    this.clear();
    entries.forEach(([key, value]) => this.set(key, value));

    return this;
  }

  find(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): V | undefined {
    // eslint-disable-next-line no-param-reassign
    if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
    this.forEach((value, key) => {
      if (fn(value, key, this)) return value;
      return;
    });

    return undefined;
  }

  findKey(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): K | undefined {
    // eslint-disable-next-line no-param-reassign
    if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
    this.forEach((value, key) => {
      if (fn(value, key, this)) return key;
      return;
    });
    return undefined;
  }

  sweep(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): number {
    // eslint-disable-next-line no-param-reassign
    if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
    const previousSize = this.size;
    this.forEach((value, key) => {
      if (fn(value, key, this)) this.delete(key);
    });
    return previousSize - this.size;
  }

  some(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): boolean {
    // eslint-disable-next-line no-param-reassign
    if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
    this.forEach((value, key) => {
      if (fn(value, key, this)) return true;
      return;
    });
    return false;
  }

  every(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): boolean {
    // eslint-disable-next-line no-param-reassign
    if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
    this.forEach((value, key) => {
      if (!fn(value, key, this)) return false;
      return;
    });
    return true;
  }

  reduce<T>(fn: (accumulator: T, value: V, key: K, collection: this) => T, initialValue?: T): T {
    let accumulator!: T;

    if (typeof initialValue !== "undefined") {
      accumulator = initialValue;
      this.forEach((value, key) => {
        accumulator = fn(accumulator, value, key, this);
      });
      return accumulator;
    }
    let first = true;
    this.forEach((value, key) => {
      if (first) {
        accumulator = value as unknown as T;
        first = false;
        return;
      }
      accumulator = fn(accumulator, value, key, this);
    });

    if (first) {
      throw new TypeError("Reduce of empty collection with no initial value");
    }

    return accumulator;
  }

  each(fn: (value: V, key: K, collection: this) => void, thisArg?: unknown): this {
    this.forEach(fn as (value: V, key: K, map: Map<K, V>) => void, thisArg);
    return this;
  }

  tap(fn: (collection: this) => void, thisArg?: unknown): this {
    // eslint-disable-next-line no-param-reassign
    if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
    fn(this);
    return this;
  }

  equals(collection: Collection<K, V>) {
    if (!collection) return false; // runtime check
    if (this === collection) return true;
    if (this.size !== collection.size) return false;
    this.forEach((value, key) => {
      if (!collection.has(key)) return false;
      if (value !== collection.get(key)) return false;
      return;
    });
    return true;
  }

  toJSON() {
    return [...this.values()];
  }

  toString() {
    return `[${[...this.values()].join(", ")}]`;
  }

  private static defaultSort<Val>(firstValue: Val, secondValue: Val): number {
    return Number(firstValue > secondValue) || Number(firstValue === secondValue) - 1;
  }
}
