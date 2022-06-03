import { Client as RevoltClient } from "revolt.js";
import { CachedManager } from "./CachedManager";
import { Guild } from "../Guild";

export class GuildManager extends CachedManager {
  constructor(client: RevoltClient, iterable = false) {
    super(client, Guild, iterable);
    // FIXME: May cause performance issues with uncached guilds.
    this.revoltClient.servers.forEach((server, key) => {
      this._add(server, true, { id: key });
    });
  }
}
