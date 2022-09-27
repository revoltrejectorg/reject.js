import { Client } from "../Client";
import { Collection } from "../DiscordJS_Stubs";
import { BaseManager } from "./BaseManager";

export class DataManager<T> extends BaseManager {
  readonly holds: any;

  /**
   * Unimplemented in Discord.js, but it exists so we may as well have it.
   * @abstract
   */
  get cache(): Collection<any, any> {
    throw new Error("Not implemented");
  }

  constructor(client: Client, holds: any) {
    super(client);
    this.holds = holds;
  }

  resolve(idOrInstance: any): T | null {
    if (idOrInstance instanceof this.holds) return idOrInstance;
    if (typeof idOrInstance === "string") return this.cache.get(idOrInstance) ?? null;
    return null;
  }

  resolveId(idOrInstance: any) {
    if (idOrInstance instanceof this.holds) return idOrInstance.id;
    if (typeof idOrInstance === "string") return idOrInstance;
    return null;
  }

  valueOf() {
    return this.cache;
  }
}
