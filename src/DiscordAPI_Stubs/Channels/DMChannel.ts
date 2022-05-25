import { DMChannel as DiscordDMChannel } from "discord.js";
import { fixme } from "../../Utils";
import { Message } from "../Message";
import User from "../User";
import { BaseGuildTextChannel } from "./BaseGuildTextChannel";

export class DMChannel extends BaseGuildTextChannel implements DiscordDMChannel {
  // @ts-ignore
  get messages() {
    fixme("no message history support yet");
    return;
  }

  // @ts-ignore
  get recipient() {
    if (!this.revoltChannel.recipient) return;
    return new User(this.revoltChannel.recipient);
  }

  // @ts-ignore
  get lastMessage() {
    if (!this.revoltChannel.last_message) return;
    return new Message(this.revoltChannel.last_message);
  }
}
