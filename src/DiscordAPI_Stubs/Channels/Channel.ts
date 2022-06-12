import { Channel as revoltChannel } from "revolt.js";
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
    super(new Client(channel.client));
    this.revoltChannel = channel;
  }
}
