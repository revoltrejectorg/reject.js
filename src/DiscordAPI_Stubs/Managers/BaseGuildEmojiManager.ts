import { Client as revoltClient } from "revolt.js";
import { Emoji } from "../structures";
import { CachedManager } from "./CachedManager";

export class BaseGuildEmojiManager extends CachedManager<Emoji> {
  constructor(client: revoltClient, iterable: boolean) {
    super(client, Emoji as any, iterable);
  }

  resolveIdentifer(emoji: string) {
    return emoji;
  }
}
