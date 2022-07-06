import { Client as RevoltClient } from "revolt.js";
import { CachedManager } from "./CachedManager";
import { Guild } from "../Guild";

export class GuildManager extends CachedManager {
  constructor(client: RevoltClient, iterable = false) {
    super(client, Guild, iterable);
    // FIXME: May cause performance issues with uncached guilds.
    this.revoltClient.servers.forEach((server, key) => {
      this._add(new Guild(server), true, { id: key });
    });
  }

  // FIXME: partial stub
  async create(name: string) {
    const srv = await this.revoltClient.servers.createServer({
      name,
    });
    if (this.cache.has(srv._id)) return this.cache.get(srv._id);

    return this._add(new Guild(srv), true, { id: srv._id });
  }
}
