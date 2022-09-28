import { ChannelType } from "discord.js";
import { User } from "../User";
import { TextBasedChannel } from "./TextBasedChannel";

export class DMChannel extends TextBasedChannel {
  declare type: ChannelType.DM;

  get partial() {
    return (typeof this.lastMessageId === "undefined") as false;
  }

  get recipient() {
    if (!this.revoltChannel.recipient) return null;
    return new User(this.revoltChannel.recipient, this.rejectClient);
  }

  get recipientId() {
    return this.recipient?.id;
  }
}
