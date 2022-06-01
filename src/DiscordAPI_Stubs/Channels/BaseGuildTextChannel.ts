import {
  MessageOptions,
  ChannelWebhookCreateOptions as DiscordChannelWebhookCreateOptions,
} from "discord.js";
import { User } from "../User";
import { Reject as rejectDiscordAPI } from "../../Utils/DiscordAPI/DiscordParamsConverter";
import { Message } from "../Message";
import { Webhook } from "../Webhook";
import { GuildChannel } from "./GuildChannel";
import { GuildMember } from "../GuildMember";

export class BaseGuildTextChannel extends GuildChannel {
  get nsfw() { return this.revoltChannel.nsfw === true; }

  get description() { return this.revoltChannel.description; }

  // @ts-ignore
  get lastMessage() {
    if (!this.revoltChannel.last_message) return;
    return new Message(this.revoltChannel.last_message);
  }

  get lastMessageId() {
    return this.lastMessage?.id;
  }

  async send(content: string | MessageOptions) {
    // return the original string if it's a string, otherwise convert it to revolt params
    const convertedParams = typeof content === "string" ? content : rejectDiscordAPI
      .Utils
      .DiscordAPI
      .discordParamsToRevolt(content);

    if (this instanceof User || this instanceof GuildMember) {
      const ch = await this.createDM();
      ch?.send(convertedParams);
    }

    const msg = await this.revoltChannel.sendMessage(convertedParams);

    return new Message(msg);
  }

  async sendTyping(timeout: number = 5000) {
    // TODO: stop typing when we send a message
    this.revoltChannel.startTyping();
    setTimeout(() => {
      this.revoltChannel.stopTyping();
    }, timeout);
  }

  async createWebhook(name: string, options?: DiscordChannelWebhookCreateOptions) {
    return new Webhook(name, this, options);
  }

  async bulkDelete(amount: number) {
    const messages = await this.revoltChannel.fetchMessages({
      limit: amount,
    });
    const ids = messages.map((m) => m._id);

    await this.revoltChannel.deleteMessages(ids);

    return messages;
  }
}
