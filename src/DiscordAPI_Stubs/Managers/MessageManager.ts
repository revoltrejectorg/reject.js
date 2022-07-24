import { Channel } from "../Channels";
import { Message } from "../Message";
import { CachedManager } from "./CachedManager";

export class MessageManager extends CachedManager<Message> {
  protected rejectChannel: Channel;

  get channel() {
    return this.rejectChannel;
  }

  constructor(channel: Channel, iterable: boolean) {
    super(channel.rejectClient.revoltClient, Message as any, iterable);

    this.rejectChannel = channel;
  }
}
