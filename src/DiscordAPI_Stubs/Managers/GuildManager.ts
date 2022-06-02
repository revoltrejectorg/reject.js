import { Client as RevoltClient } from "revolt.js";
import { CachedManager } from "./CachedManager";
import { Guild } from "../Guild";

export class GuildManager extends CachedManager {
  constructor(client: RevoltClient, iterable = false) {
    super(client, Guild, iterable);
  }
}
