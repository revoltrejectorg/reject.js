import { User } from "../User";
import { BaseGuildTextChannel } from "./BaseGuildTextChannel";

export class DMChannel extends BaseGuildTextChannel {
  get partial() {
    return (typeof this.lastMessageId === "undefined") as false;
  }

  get recipient() {
    if (!this.revoltChannel.recipient) return null as any;
    return new User(this.revoltChannel.recipient);
  }
}
