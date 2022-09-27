import { ChannelType } from "discord.js";
import { Channel as revoltChannel } from "revolt.js";
import { convertChannelType } from "../../Utils/DiscordAPI";
import { baseClass } from "../Base";
import { Client } from "../Client";

export class BaseChannel extends baseClass {
  revoltChannel: revoltChannel;

  get createdAt() { return new Date(this.revoltChannel.createdAt); }

  get createdTimestamp() { return this.revoltChannel.createdAt; }

  deleted = false;

  get id() { return this.revoltChannel._id; }

  // Always false outside of DM channels
  get partial() {
    return false;
  }

  async delete() {
    this.revoltChannel.delete();
    return this;
  }

  type: ChannelType;

  isTextBased() {
    return "messages" in this;
  }

  isDMBased() {
    return [ChannelType.DM, ChannelType.GroupDM].includes(this.type);
  }

  isVoiceBased() {
    return "bitrate" in this;
  }

  isThread() {
    return false;
  }

  /**
   * @deprecated since version 14.0.0
  */
  isText() {
    return (this.type === ChannelType.GuildText
      || this.type === ChannelType.DM
      || this.type === ChannelType.GroupDM);
  }

  /**
   * @deprecated since version 14.0.0
  */
  isVoice() {
    return this.type === ChannelType.GuildVoice;
  }

  /**
   * @deprecated since version 14.0.0
  */
  isDM() {
    return this.type === ChannelType.DM;
  }

  /**
   * @deprecated since version 14.0.0
  */
  isDirectory() {
    return false;
  }

  toString() {
    return `<#${this.id}>`;
  }

  constructor(channel: revoltChannel, client: Client) {
    super(client);
    this.revoltChannel = channel;

    this.type = convertChannelType(this.revoltChannel.channel_type, false);
  }
}
