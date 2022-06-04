import {
  MessageOptions,
  ChannelWebhookCreateOptions as DiscordChannelWebhookCreateOptions,
} from "discord.js";
import { Message } from "../Message";
import { Webhook } from "../Webhook";
import { GuildChannel } from "./GuildChannel";
import { msgParamsConverter } from "../../Utils/DiscordAPI";

export class BaseGuildTextChannel extends GuildChannel {
  get nsfw() { return this.revoltChannel.nsfw === true; }

  get description() { return this.revoltChannel.description; }

  // @ts-ignore
  get lastMessage() {
    if (!this.revoltChannel.last_message) return;
    return new Message(this.revoltChannel.last_message);
  }

  get lastMessageId() {
    return this.revoltChannel.last_message_id;
  }

  async send(content: string | MessageOptions): Promise<Message> {
    const convertedParams = msgParamsConverter(content);

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
