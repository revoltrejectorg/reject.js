import { Message as revoltMessage } from "revolt.js";
import {
  ChannelType, MessageEditOptions, MessageCreateOptions, Attachment, MessageReference,
} from "discord.js";
import { TextBasedChannels } from "./Channels";
import { User } from "./User";
import { GuildMember } from "./GuildMember";
import { Guild } from "./Guild";
import { baseClass } from "./Base";
import {
  cleanContent, createChannelfromRevolt, msgEditConvert, msgParamsConverter, revoltEmbedToDiscord,
} from "../Utils/DiscordAPI";
import { Client } from "./Client";
import { Emoji, MessageMentions, MessageReaction } from "./structures";
import { ReactionManager } from "./Managers";
import { Collection } from "./DiscordJS_Stubs";
import { Snowflake } from "./types";
import { AutumnURL } from "../constants";

/**
 * reference https://discord.js.org/#/docs/discord.js/stable/class/Message
 */
export class Message extends baseClass {
  revoltMsg: revoltMessage;

  get applicationId() { return this.revoltMsg.client.user?._id ?? null; }

  get content() {
    return this.revoltMsg.content
      ?.replace(/\|\|.+\|\|/gs, (match) => `\\${match}`)
      // Translate !!Revite spoilers!! to ||Discord spoilers||
      .replace(
        /!!.+!!/g,
        (match) => `||${match.substring(2, match.length - 2)}||`,
      ) ?? "fixme";
  }

  // FIXME: potential for the message to be a system message
  channel?: TextBasedChannels;

  get channelId() {
    return this.channel?.id;
  }

  get author() {
    return new User(this.revoltMsg.author!, this.rejectClient);
  }

  get member() {
    if (!this.revoltMsg.member) return null;
    return new GuildMember(this.revoltMsg.member, this.rejectClient);
  }

  get url() {
    return this.revoltMsg.url;
  }

  get cleanContent() {
    if (!this.channel) return this.content;

    return this.content != null ? cleanContent(this.content, this.channel) : null;
  }

  get mentions() {
    return new MessageMentions(this);
  }

  reactions = new ReactionManager(this);

  get embeds() {
    return this.revoltMsg.embeds?.map((embed) => revoltEmbedToDiscord(embed)) ?? [];
  }

  get attachments() {
    const revoltAttachments = this.revoltMsg.attachments;

    const attachments: Collection<Snowflake, Attachment> = new Collection();

    revoltAttachments?.forEach((attachment) => {
      attachments.set(attachment._id, {
        attachment: null as any,
        contentType: null,
        description: null,
        ephemeral: false,
        height: null,
        id: attachment._id,
        name: attachment.filename,
        proxyURL: `${AutumnURL}/attachments/${attachment._id}`,
        size: attachment.size,
        spoiler: false,
        url: `${AutumnURL}/attachments/${attachment._id}`,
        width: null,
        toJSON: () => "" as any,
      });
    });

    return attachments;
  }

  get editedTimestamp() {
    return this.revoltMsg.edited?.getUTCMilliseconds();
  }

  get editable() {
    const precheck = Boolean(this.author.id === this.client.user?.id
      && (!this.guild || (this.channel?.type !== ChannelType.DM && this.channel?.viewable)));
    // Thread messages cant be edited if they're locked, regardless of perms.
    if (this.channel?.isThread()) {
      // FIXME: Need to check for Thread.locked in the future.
      return precheck;
    }
    return precheck;
  }

  get editedAt() {
    return this.editedTimestamp && new Date(this.editedTimestamp);
  }

  get createdTimestamp() {
    return this.revoltMsg.createdAt;
  }

  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  get id() {
    return this.revoltMsg._id;
  }

  get partial() {
    return typeof this.content !== "string" || !this.author;
  }

  webhookId?: string;

  get nonce() {
    return this.revoltMsg.nonce;
  }

  tts = false;

  get guild() {
    if (!this.revoltMsg.channel?.server) return;
    return new Guild(this.revoltMsg.channel.server, this.rejectClient);
  }

  reference?: MessageReference;

  constructor(rMsg: revoltMessage, client: Client) {
    super(client);
    this.revoltMsg = rMsg;

    if (rMsg.channel) this.channel = createChannelfromRevolt(rMsg.channel, this.rejectClient);

    if (rMsg.reply_ids && rMsg.reply_ids[0]) {
      this.reference = {
        channelId: this.channelId!,
        guildId: this.guild?.id,
        // WONTFIX: Revolt can have multiple replies, but Discord only allows one.
        messageId: rMsg.reply_ids[0],
      };
    }
  }

  async reply(content: string | MessageCreateOptions, mention?: boolean | undefined) {
    const convertedParams = await msgParamsConverter(content, this.revoltMsg.client);

    const msg = await this.revoltMsg.reply(convertedParams, mention);

    return new Message(msg!, this.rejectClient);
  }

  async delete() {
    await this.revoltMsg.delete();
    return this;
  }

  async edit(content: string | MessageEditOptions) {
    const editParams = await msgEditConvert(content);

    await this.revoltMsg.edit(editParams);

    return this;
  }

  async inGuild() {
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

  // FIXME: revolt.js won't auto-resolve "classic" emojis unlike discord.
  async react(emoji: string) {
    const revoltEmoji = this.client.revoltClient.emojis.get(emoji);
    if (!revoltEmoji) throw new Error("Invalid emoji!");

    await this.revoltMsg.react(emoji);
    return new MessageReaction(this, {
      emoji: revoltEmoji,
    });
  }

  async awaitReactions() {}

  async createReactionCollector() {}

  async fetchWebhook() {}
}
