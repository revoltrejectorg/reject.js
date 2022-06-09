import { Message as revoltMessage, User as RevoltUser } from "revolt.js";
import { Collection, Message as DiscordMessage } from "discord.js";
import { fixme } from "../Utils";
import { BaseGuildTextChannel } from "./Channels";
import { User } from "./User";
import { GuildMember } from "./GuildMember";
import { Guild } from "./Guild";
import { baseClass } from "./Base";
import { msgParamsConverter } from "../Utils/DiscordAPI";
import { Client } from "./Client";

export class MessageMentions {
  private revoltUsers?: (RevoltUser | undefined)[];

  users = new Collection<string, User>();

  constructor(rUsers?: (RevoltUser | undefined)[]) {
    if (!rUsers) return;

    this.revoltUsers = rUsers;
    this.revoltUsers.forEach((user) => {
      if (!user) return;
      this.users.set(user._id, new User(user));
    });
  }
}

/**
 * reference https://discord.js.org/#/docs/discord.js/stable/class/Message
 */
export class Message extends baseClass {
  private revoltMsg: revoltMessage;

  get applicationId() { return this.revoltMsg.client.user?._id ?? null; }

  get content() { return this.revoltMsg.content?.toString() ?? "fixme"; }

  // FIXME: potential for the message to be a system message
  get channel() {
    return new BaseGuildTextChannel(this.revoltMsg.channel!);
  }

  get channelId() { return this.channel.id; }

  get author() { return new User(this.revoltMsg.author!); }

  get member() {
    if (!this.revoltMsg.member) return;
    return new GuildMember(this.revoltMsg.member);
  }

  get url() { return this.revoltMsg.url; }

  get mentions() { return new MessageMentions(this.revoltMsg.mentions); }

  // FIXME: revolt may add emote reactions in the future
  get reactions() { return []; }

  get embeds() { return this.revoltMsg.embeds; }

  get attachments() { return this.revoltMsg.attachments; }

  get edited() { return this.revoltMsg.edited; }

  get editedTimestamp() { return this.revoltMsg.edited?.getUTCMilliseconds(); }

  get createdTimestamp() { return this.revoltMsg.createdAt; }

  get createdAt() { return new Date(this.revoltMsg.createdAt); }

  get id() {
    return this.revoltMsg._id;
  }

  webhookId?: string;

  get nonce() { return this.revoltMsg.nonce; }

  tts = false;

  get guild() {
    if (!this.revoltMsg.channel?.server) return;
    return new Guild(this.revoltMsg.channel.server);
  }

  constructor(rMsg: revoltMessage) {
    super(new Client(rMsg.client));
    this.revoltMsg = rMsg;
  }

  async reply(content: string, mention?: boolean | undefined) {
    const convertedParams = await msgParamsConverter(content, this.revoltMsg.client);

    const msg = await this.revoltMsg.reply(convertedParams);

    return new Message(msg!);
  }

  async delete() {
    this.revoltMsg.delete().catch(() => fixme(`Failed to delete message ${this.id}`));
    return this;
  }

  async edit(content: string): Promise<Message> {
    const convertedParams = msgParamsConverter(content, this.revoltMsg.client);

    await this.revoltMsg.edit(convertedParams as any);

    return this;
  }

  async inGuild(): Promise<boolean> {
    if (this.revoltMsg.channel?.server) return true;
    return false;
  }

  toString() {
    return this.revoltMsg.content?.toString() ?? "FIXME";
  }

  // Unimplemented stuff
  async startThread() { return this; }

  async pin() { return this; }

  async unpin() {}

  async react() {}

  async awaitReactions() {}

  async createReactionCollector() {}

  async fetchWebhook() {}
}
