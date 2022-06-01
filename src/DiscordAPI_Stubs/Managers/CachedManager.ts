import { Collection } from "../DiscordJS_Stubs";
import { DataManager } from "./DataManager";

export class CachedManager extends DataManager {
  protected _cache = new Collection<string, any>();

  get cache() {
    return this._cache;
  }
}
