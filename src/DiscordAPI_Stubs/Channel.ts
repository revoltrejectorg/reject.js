import { Channel as revoltChannel } from "revolt.js";
import {
  DMChannel as DiscordDMChannel,
  ChannelWebhookCreateOptions as DiscordChannelWebhookCreateOptions,
} from "discord.js";

import MessageOptions from "revolt.js/dist/maps/Messages";
import { Reject as rejectDiscordAPI } from "../Utils/DiscordAPI/DiscordParamsConverter";
import { Message } from "./Message";
import { baseClass } from "./Base";
import { fixme } from "../Utils/Logger";
import User from "./User";
import { Guild } from "./Guild";
import { Client } from "../Client";
import { Webhook } from "./Webhook";

export class Channel extends baseClass {
  protected revoltChannel: revoltChannel;

  get client() { return new Client(this.revoltChannel.client); }

  get createdAt() { return new Date(this.revoltChannel.createdAt * 1000); }

  get createdTimestamp() { return this.revoltChannel.createdAt; }

  deleted = false;

  get id() { return this.revoltChannel._id; }

  /** FIXME: no revolt equiv. */
  partial = false;

  get channel_type() { return this.revoltChannel.channel_type; }

  async delete() {
    this.revoltChannel.delete();
    return this;
  }

  isThread() {
    return false;
  }

  isText() {
    const type = this.revoltChannel.channel_type;
    return (type === "TextChannel" || type === "DirectMessage" || type === "Group");
  }

  isVoice() {
    return this.revoltChannel.channel_type === "VoiceChannel";
  }

  isDirectory() {
    return false;
  }

  toString() {
    return `<#${this.id}>`;
  }

  constructor(channel: revoltChannel) {
    super();
    this.revoltChannel = channel;
  }
}

export class GuildChannel extends Channel {
  /** FIXME: Revolt.js needs perms api */
  readonly deletable = true;

  guild?: Guild;

  get guildid() { return this.guild?.id ?? "0"; }

  readonly managable = true;

  /** FIXME: improper members stub */
  readonly members = [];

  get name() { return this.revoltChannel.name; }

  /** FIXME: cant get category for this channel */
  readonly parent?: any;

  parentId?: string;

  position = 0;

  rawPosition = 0;

  /**  FIXME: not all equivs can be added */
  // @ts-ignore
  get type() {
    return rejectDiscordAPI
      .Utils
      .DiscordAPI
      .ChannelTypeConverter(this.revoltChannel.channel_type);
  }

  readonly viewable = true;

  constructor(channel: revoltChannel) {
    super(channel);
    if (channel.server) { this.guild = new Guild(channel.server); }
  }

  async clone() {
    throw new Error("Method not implemented.");
  }
}

export class BaseGuildTextChannel extends GuildChannel {
  get nsfw() { return this.revoltChannel.nsfw === true; }

  get description() { return this.revoltChannel.description; }

  async send(content: string | MessageOptions) {
    const msg = await this.revoltChannel.sendMessage((() => {
      if (rejectDiscordAPI.Utils.DiscordAPI.checkifString(content)) return content;
      return rejectDiscordAPI.Utils.DiscordAPI.discordParamsToRevolt(content as any) as any;
    })());

    return new Message(msg);
  }

  async sendTyping(timeout: number = 5000) {
    this.revoltChannel.startTyping();
    setTimeout(() => {
      this.revoltChannel.stopTyping();
    }, timeout);
  }

  async createWebhook(name: string, options?: DiscordChannelWebhookCreateOptions) {
    return new Webhook(name, this, options);
  }

  async bulkDelete(amount: number) {
    const messages = await this.revoltChannel.fetchMessages({
      limit: amount,
    });
    messages.forEach((message) => {
      message.delete();
    });

    return messages;
  }
}

export class DMChannel extends BaseGuildTextChannel implements DiscordDMChannel {
  // @ts-ignore
  get messages() {
    fixme("no message history support yet");
    return;
  }

  // @ts-ignore
  get recipient() {
    if (!this.revoltChannel.recipient) return;
    return new User(this.revoltChannel.recipient);
  }

  // @ts-ignore
  get lastMessage() {
    if (!this.revoltChannel.last_message) return;
    return new Message(this.revoltChannel.last_message);
  }
}
