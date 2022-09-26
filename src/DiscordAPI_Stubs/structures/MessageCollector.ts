import { ChannelType, Events, MessageCollectorOptions } from "discord.js";
import { BaseChannel, BaseGuildTextChannel } from "../Channels";
import { Guild } from "../Guild";
import { Message } from "../Message";
import { Collector } from "./interfaces";

export class MessageCollector extends Collector {
  channel: BaseChannel;

  received = 0;

  constructor(channel: BaseChannel, options: MessageCollectorOptions) {
    super(channel.client, options);

    this.channel = channel;

    const bulkDeleteListener = (...messages: Message[]) => {
      // eslint-disable-next-line no-restricted-syntax
      messages.forEach((message) => this.handleDispose(message));
    };

    this.client.incrementMaxListeners();

    this.client.on(Events.MessageCreate, this.handleCollect);
    this.client.on(Events.MessageDelete, this.handleDispose);
    this.client.on(Events.MessageBulkDelete, bulkDeleteListener);
    this.client.on(Events.ChannelDelete, this._handleChannelDeletion);
    this.client.on(Events.ThreadDelete, this._handleThreadDeletion);
    this.client.on(Events.GuildDelete, this._handleGuildDeletion);

    this.once("end", () => {
      this.client.removeListener(Events.MessageCreate, this.handleCollect);
      this.client.removeListener(Events.MessageDelete, this.handleDispose);
      this.client.removeListener(Events.MessageBulkDelete, bulkDeleteListener);
      this.client.removeListener(Events.ChannelDelete, this._handleChannelDeletion);
      this.client.removeListener(Events.ThreadDelete, this._handleThreadDeletion);
      this.client.removeListener(Events.GuildDelete, this._handleGuildDeletion);
      this.client.decrementMaxListeners();
    });
  }

  collect(message: Message) {
    if (message.channelId !== this.channel.id) return null;
    this.received += 1;
    return message.id;
  }

  dispose(message: Message) {
    return message.channelId === this.channel.id ? message.id : null;
  }

  _handleChannelDeletion(channel: BaseChannel) {
    if (channel.id === this.channel.id
      || (channel.type === ChannelType.DM
      && channel.id === (this.channel as BaseGuildTextChannel).parentId)
    ) {
      this.stop("channelDelete");
    }
  }

  _handleThreadDeletion(thread: BaseChannel) {
    if (thread.id === this.channel.id) {
      this.stop("threadDelete");
    }
  }

  _handleGuildDeletion(guild: Guild) {
    if (this.channel.type === ChannelType.DM) return;

    if (guild.id === (this.channel as BaseGuildTextChannel).guild?.id) {
      this.stop("guildDelete");
    }
  }
}
