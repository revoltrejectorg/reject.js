import { Emoji as revoltEmoji } from "revolt.js";
import { Client } from "../Client";
import { Guild } from "../Guild";
import { Emoji } from "./Emoji";

export class BaseGuildEmoji extends Emoji {
  available = true;

  guild: Guild;

  managed = false;

  requiresColons = true;

  constructor(client: Client, rEmoji: revoltEmoji, guild: Guild) {
    super(client, rEmoji);

    this.guild = guild;
  }
}
