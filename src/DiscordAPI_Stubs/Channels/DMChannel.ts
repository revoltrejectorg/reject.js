import { DMChannel as DiscordDMChannel } from "discord.js";
import { fixme } from "../../Utils";
import { Message } from "../Message";
import { User } from "../User";
import { BaseGuildTextChannel } from "./BaseGuildTextChannel";

export class DMChannel extends BaseGuildTextChannel implements DiscordDMChannel {
  // @ts-ignore correct impl.
  get partial() {
    return typeof this.lastMessageId === "undefined";
  }

  // @ts-ignore
  get recipient() {
    if (!this.revoltChannel.recipient) return;
    return new User(this.revoltChannel.recipient);
  }
}
