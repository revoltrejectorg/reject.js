import { Channel as revoltChannel } from "revolt.js";
import { CachedManager } from "./CachedManager";

export class MessageManager extends CachedManager {
  protected revoltChannel: revoltChannel;

  constructor(channel: revoltChannel, iterable: boolean) {
    super(channel.client, iterable);

    this.revoltChannel = channel;
  }
}
