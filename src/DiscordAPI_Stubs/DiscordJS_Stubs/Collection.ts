/* eslint-disable no-dupe-class-members */
declare type Keep<V> = {
  keep: true;
  value: V;
} | {
  keep: false;
};

export interface Collection<K, V> extends Map<K, V> {
  // eslint-disable-next-line no-use-before-define
  constructor: CollectionConstructor;
}

export interface CollectionConstructor {
  new (): Collection<unknown, unknown>;
  new <K, V>(entries?: ReadonlyArray<readonly [K, V]> | null): Collection<K, V>;
  new <K, V>(iterable: Iterable<readonly [K, V]>): Collection<K, V>;
  readonly prototype: Collection<unknown, unknown>;
  readonly [Symbol.species]: CollectionConstructor;
}

export type ReadonlyCollection<K, V> = ReadonlyMap<K, V> &
  Omit<Collection<K, V>, "forEach" | "ensure" | "reverse" | "sweep" | "sort" | "get" | "set" | "delete">;

export type Comparator<K, V> = (firstValue: V, secondValue: V, firstKey: K, secondKey: K) => number;

// eslint-disable-next-line no-redeclare
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

  randomKey(): K | undefined;

  randomKey(amount: number): K[];

  randomKey(amount?: number): K | K[] | undefined {
    const arr = [...this.keys()];
    if (typeof amount === "undefined") return arr[Math.floor(Math.random() * arr.length)];
    if (!arr.length || !amount) return [];

    return Array.from(
      { length: Math.min(amount, arr.length) },
      (): K => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]!,
    );
  }

  flatMap<T>(
    fn: (value: V, key: K, collection: this) => Collection<K, T>,
    thisArg?: unknown,
  ): Collection<K, T> {
    const collections = this.map(fn, thisArg);
    return new this.constructor[Symbol.species]<K, T>().concat(...collections);
  }

  concat(...collections: ReadonlyCollection<K, V>[]) {
    const newColl = this.clone();
    collections.forEach((coll) => {
      coll.forEach((value, key) => {
        newColl.set(key, value);
      });
    });

    return newColl;
  }

  reverse() {
    const entries = [...this.entries()].reverse();
    this.clear();
    entries.forEach(([key, value]) => this.set(key, value));

    return this;
  }

  find<V2 extends V>(
    fn: (value: V, key: K, collection: this) => value is V2
  ): V2 | undefined;

  find(fn: (value: V, key: K, collection: this) => boolean): V | undefined;

  find<This, V2 extends V>(
    fn: (this: This, value: V, key: K, collection: this) => value is V2,
    thisArg: This,
  ): V2 | undefined;

  find<This>(
    fn: (this: This, value: V, key: K, collection: this) => boolean, thisArg: This
  ): V | undefined;

  find(
    fn: (value: V, key: K, collection: this) => boolean,
    thisArg?: unknown,
  ): V | undefined {
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

  sweep(fn: (value: V, key: K, collection: this) => boolean): number;

  sweep<T>(fn: (this: T, value: V, key: K, collection: this) => boolean, thisArg: T): number;

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

  every<K2 extends K>(
    fn: (
      value: V,
      key: K,
      collection: this
    ) => key is K2
  ): this is Collection<K2, V>;

  every<V2 extends V>(
    fn: (value: V, key: K, collection: this) => value is V2
  ): this is Collection<K, V2>;

  every(fn: (value: V, key: K, collection: this) => boolean): boolean;

  every<This, K2 extends K>(
    fn: (this: This, value: V, key: K, collection: this) => key is K2,
    thisArg: This,
  ): this is Collection<K2, V>;

  every<This, V2 extends V>(
    fn: (this: This, value: V, key: K, collection: this) => value is V2,
    thisArg: This,
  ): this is Collection<K, V2>;

  every<This>(
    fn: (
      this: This,
      value: V, key: K,
      collection: this
  ) => boolean, thisArg: This): boolean;

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

  each(fn: (value: V, key: K, collection: this) => void): this;

  each<T>(fn: (this: T, value: V, key: K, collection: this) => void, thisArg: T): this;

  each(fn: (value: V, key: K, collection: this) => void, thisArg?: unknown): this {
    this.forEach(fn as (value: V, key: K, map: Map<K, V>) => void, thisArg);
    return this;
  }

  tap(fn: (collection: this) => void): this;

  tap<T>(fn: (this: T, collection: this) => void, thisArg: T): this;

  tap(fn: (collection: this) => void, thisArg?: unknown): this {
    if (typeof fn !== "function") throw new TypeError(`${fn} is not a function`);
    // eslint-disable-next-line no-param-reassign
    if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
    fn(this);
    return this;
  }

  clone(): Collection<K, V> {
    return new this.constructor[Symbol.species](this);
  }

  map<T>(fn: (value: V, key: K, collection: this) => T): T[];

  map<This, T>(fn: (this: This, value: V, key: K, collection: this) => T, thisArg: This): T[];

  map<T>(fn: (value: V, key: K, collection: this) => T, thisArg?: unknown): T[] {
    if (typeof fn !== "function") throw new TypeError("Map requires a function");
    // eslint-disable-next-line no-param-reassign
    if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
    const iter = this.entries();
    return Array.from({ length: this.size }, (): T => {
      const [key, value] = iter.next().value;
      return fn(value, key, this);
    });
  }

  equals(collection: ReadonlyCollection<K, V>) {
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

  sort(compareFunction: Comparator<K, V> = Collection.defaultSort) {
    const entries = [...this.entries()];
    entries.sort((a, b): number => compareFunction(a[1], b[1], a[0], b[0]));

    super.clear();

    entries.forEach(([key, value]) => super.set(key, value));

    return this;
  }

  sorted(compareFunction: Comparator<K, V> = Collection.defaultSort) {
    return new this.constructor[Symbol.species](this)
      .sort((av, bv, ak, bk) => compareFunction(av, bv, ak, bk));
  }

  merge<T, R>(
    other: ReadonlyCollection<K, T>,
    whenInSelf: (value: V, key: K) => Keep<R>,
    whenInOther: (valueOther: T, key: K) => Keep<R>,
    whenInBoth: (value: V, valueOther: T, key: K) => Keep<R>,
  ): Collection<K, R> {
    const coll = new this.constructor[Symbol.species]<K, R>();
    const keys = new Set([...this.keys(), ...other.keys()]);
    keys.forEach((k) => {
      const hasInSelf = this.has(k);
      const hasInOther = other.has(k);

      if (hasInSelf && hasInOther) {
        const r = whenInBoth(this.get(k)!, other.get(k)!, k);
        if (r.keep) coll.set(k, r.value);
      } else if (hasInSelf) {
        const r = whenInSelf(this.get(k)!, k);
        if (r.keep) coll.set(k, r.value);
      } else if (hasInOther) {
        const r = whenInOther(other.get(k)!, k);
        if (r.keep) coll.set(k, r.value);
      }
    });
    return coll;
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
