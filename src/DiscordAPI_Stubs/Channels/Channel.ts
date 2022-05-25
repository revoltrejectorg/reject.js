import { Channel as revoltChannel } from "revolt.js";
import { baseClass } from "../Base";
import { Client } from "../../Client";

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
