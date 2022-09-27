import { Client } from "../Client";
import { baseClass } from "../Base";
import { Collection } from "../DiscordJS_Stubs";
import { DataManager } from "./DataManager";

export class CachedManager<T extends baseClass> extends DataManager<T> {
  protected _cache = new Collection<string, T>();

  get cache() {
    return this._cache;
  }

  constructor(client: Client, holds: T, iterable?: any) {
    super(client, holds);

    if (iterable) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of iterable) {
        this._add(item);
      }
    }
  }

  _add(data: any, cache = true, { id, extras = [] }: any = {}) {
    const existing = this._cache.get(id ?? data.id);
    if (existing) {
      if (cache) {
        existing._patch(data);
        return existing;
      }
      const clone = existing.clone();
      clone._patch(data);
    }

    // eslint-disable-next-line new-cap
    const entry = this.holds ? new this.holds(this.client, data, ...extras) : data;
    if (cache) this.cache.set(id ?? entry.id, entry);
    return entry;
  }
}
