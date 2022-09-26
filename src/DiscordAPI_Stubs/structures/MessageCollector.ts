import { MessageCollectorOptions } from "discord.js";
import { BaseChannel } from "../Channels";
import { Message } from "../Message";
import { Collector } from "./interfaces";

export class MessageCollector extends Collector {
  channel: BaseChannel;

  received = 0;

  constructor(channel: BaseChannel, options: MessageCollectorOptions) {
    super(channel.client, options);

    this.channel = channel;
  }

  collect(message: Message) {
    if (message.channelId !== this.channel.id) return null;
    this.received += 1;
    return message.id;
  }

  dispose(message: Message) {
    return message.channelId === this.channel.id ? message.id : null;
  }
}
