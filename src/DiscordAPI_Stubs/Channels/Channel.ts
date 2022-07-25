import { ChannelType } from "discord-api-types/v10";
import { Channel as revoltChannel } from "revolt.js";
import { convertChannelType } from "../../Utils/DiscordAPI";
import { baseClass } from "../Base";
import { Client } from "../Client";

export class Channel extends baseClass {
  revoltChannel: revoltChannel;

  get createdAt() { return new Date(this.revoltChannel.createdAt); }

  get createdTimestamp() { return this.revoltChannel.createdAt; }

  deleted = false;

  get id() { return this.revoltChannel._id; }

  // Always false outside of DM channels
  get partial() {
    return false;
  }

  get type() {
    return convertChannelType(this.revoltChannel.channel_type, false);
  }

  async delete() {
    this.revoltChannel.delete();
    return this;
  }

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
    return (this.type === "GUILD_TEXT" || this.type === "DM" || this.type === "GROUP_DM");
  }

  /**
   * @deprecated since version 14.0.0
  */
  isVoice() {
    return this.type === "GUILD_VOICE";
  }

  /**
   * @deprecated since version 14.0.0
  */
  isDM() {
    return this.type === "DM";
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

  constructor(channel: revoltChannel) {
    super(new Client(channel.client));
    this.revoltChannel = channel;
  }
}
