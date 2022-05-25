import { Message as revoltMessage } from "revolt.js/dist/maps/Messages";
import { User as RevoltUser } from "revolt.js/dist/maps/Users";
import { Collection, Message as DiscordMessage } from "discord.js";
import { fixme } from "../Utils";
import { Reject as rejectDiscordAPI } from "../Utils/DiscordAPI/DiscordParamsConverter";
import { BaseGuildTextChannel } from "./Channels";
import User from "./User";
import { Member } from "./Member";
import { Guild } from "./Guild";
import { baseClass } from "./Base";

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
 * @reference https://discord.js.org/#/docs/discord.js/stable/class/Message
 */
export class Message extends baseClass {
  private revoltMsg: revoltMessage;

  get applicationId() { return this.revoltMsg.client.user?._id ?? null; }

  get content() { return this.revoltMsg.content?.toString() ?? "fixme"; }

  channel: BaseGuildTextChannel;

  get channelId() { return this.channel.id; }

  get channel_id() { return this.channel.id; }

  get author() { return new User(this.revoltMsg.author!); }

  get member() {
    if (!this.revoltMsg.member) return;
    return new Member(this.revoltMsg.member);
  }

  get url() { return this.revoltMsg.url; }

  get mentions() { return new MessageMentions(this.revoltMsg.mentions); }

  get reactions() { fixme("revolt doesn't support reactions yet"); return []; }

  get embeds() { return this.revoltMsg.embeds; }

  get attachments() { return this.revoltMsg.attachments; }

  get edited() { return this.revoltMsg.edited; }

  get editedTimestamp() { fixme("revolt has no struct for editedtimestamp"); return Date.now(); }

  get createdTimestamp() { return this.createdAt; }

  get createdAt() { return this.revoltMsg.createdAt; }

  get webhookId() {
    fixme("revolt doesn't support webhooks yet");
    return;
  }

  get nonce() { return this.revoltMsg.nonce; }

  get tts() { fixme("revolt doesn't support tts"); return false; }

  get guild() {
    if (!this.revoltMsg.channel?.server) return;
    return new Guild(this.revoltMsg.channel.server);
  }

  constructor(rMsg: revoltMessage) {
    super();
    this.revoltMsg = rMsg;
    this.channel = new BaseGuildTextChannel(this.revoltMsg.channel!);
  }

  async reply(content: string, mention?: boolean | undefined): Promise<Message | undefined> {
    const msg = await this.revoltMsg.reply((() => {
      if (rejectDiscordAPI.Utils.DiscordAPI.checkifString(content)) return content;
      return rejectDiscordAPI.Utils.DiscordAPI.discordParamsToRevolt(content as any);
    })());

    return new Message(msg!);
  }

  async delete(): Promise<Message> {
    this.revoltMsg.delete().catch(() => fixme(`Failed to delete message ${this.revoltMsg._id}`));
    return this;
  }

  async edit(content: string): Promise<Message> {
    await this.revoltMsg.edit((() => {
      if (rejectDiscordAPI.Utils.DiscordAPI.checkifString(content)) return content;

      return rejectDiscordAPI.Utils.DiscordAPI.discordParamsToRevolt(content as any) as any;
    })());

    return this;
  }

  async inGuild(): Promise<boolean> {
    if (this.revoltMsg.channel?.server) return true;
    return false;
  }

  /** None of these have correct implementations */
  async startThread() { return this as unknown as DiscordMessage<boolean>; }

  async pin() { return this as unknown as DiscordMessage<boolean>; }

  async unpin() {
    fixme("unpin stub");
  }

  async react() {
    fixme("react stub");
  }

  async awaitReactions() {
    fixme("awaitReactions stub");
  }

  async createReactionCollector() {
    fixme("createReactionCollector stub");
  }

  async fetchWebhook() {
    fixme("fetchWebhook stub");
  }

  toString() {
    return this.revoltMsg.content?.toString() ?? "FIXME";
  }
}
