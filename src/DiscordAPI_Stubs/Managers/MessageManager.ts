import { Channel } from "../Channels";
import { Message } from "../Message";
import { CachedManager } from "./CachedManager";

export class MessageManager extends CachedManager {
  protected rejectChannel: Channel;

  get channel() {
    return this.rejectChannel;
  }

  constructor(channel: Channel, iterable: boolean) {
    super(channel.rejectClient.revoltClient, Message, iterable);

    this.rejectChannel = channel;
  }
}
