import { Channel as revoltChannel } from "revolt.js";
import { Message } from "../Message";
import { CachedManager } from "./CachedManager";

export class MessageManager extends CachedManager {
  protected revoltChannel: revoltChannel;

  constructor(channel: revoltChannel, iterable: boolean) {
    super(channel.client, Message, iterable);

    this.revoltChannel = channel;
  }
}
