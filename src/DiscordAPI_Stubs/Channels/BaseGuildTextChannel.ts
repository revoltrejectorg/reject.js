import {
  MessageOptions,
  ChannelWebhookCreateOptions as DiscordChannelWebhookCreateOptions,
} from "discord.js";
import { Reject as rejectDiscordAPI } from "../../Utils/DiscordAPI/DiscordParamsConverter";
import { Message } from "../Message";
import { Webhook } from "../Webhook";
import { GuildChannel } from "./GuildChannel";

export class BaseGuildTextChannel extends GuildChannel {
  get nsfw() { return this.revoltChannel.nsfw === true; }

  get description() { return this.revoltChannel.description; }

  async send(content: string | MessageOptions) {
    const msg = await this.revoltChannel.sendMessage((() => {
      if (rejectDiscordAPI.Utils.DiscordAPI.checkifString(content)) return content;
      return rejectDiscordAPI.Utils.DiscordAPI.discordParamsToRevolt(content as any) as any;
    })());

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
