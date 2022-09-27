import { Client as RevoltClient } from "revolt.js";
import { CachedManager } from "./CachedManager";
import { Guild } from "../Guild";
import { Client } from "../Client";

export class GuildManager extends CachedManager<Guild> {
  constructor(client: Client, iterable = false) {
    super(client, Guild as any, iterable);
    // FIXME: May cause performance issues with uncached guilds.
    this.revoltClient.servers.forEach((server, key) => {
      this._add(new Guild(server, this.client), true, { id: key });
    });
  }

  // FIXME: partial stub
  async create(name: string) {
    const srv = await this.revoltClient.servers.createServer({
      name,
    });
    if (this.cache.has(srv._id)) return this.cache.get(srv._id);

    return this._add(new Guild(srv, this.client), true, { id: srv._id });
  }
}
