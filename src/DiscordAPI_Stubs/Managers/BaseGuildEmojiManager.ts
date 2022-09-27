import { Client as revoltClient } from "revolt.js";
import { Client } from "../Client";
import { Emoji } from "../structures";
import { CachedManager } from "./CachedManager";

export class BaseGuildEmojiManager extends CachedManager<Emoji> {
  constructor(client: Client, iterable: boolean) {
    super(client, Emoji as any, iterable);
  }

  resolveIdentifer(emoji: string) {
    return emoji;
  }
}
