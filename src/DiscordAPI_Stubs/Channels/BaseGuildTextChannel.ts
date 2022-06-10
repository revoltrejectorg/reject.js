import {
  MessageOptions,
  ChannelWebhookCreateOptions as DiscordChannelWebhookCreateOptions,
} from "discord.js";
import { Message } from "../Message";
import { Webhook } from "../Webhook";
import { GuildChannel } from "./GuildChannel";
import { charLimitChecker, msgParamsConverter } from "../../Utils/DiscordAPI";
import { MessageManager } from "../Managers";

export class BaseGuildTextChannel extends GuildChannel {
  get nsfw() { return this.revoltChannel.nsfw; }

  get description() { return this.revoltChannel.description; }

  get lastMessage() {
    if (!this.revoltChannel.last_message) return;
    return new Message(this.revoltChannel.last_message);
  }

  lastPinTimestamp = 0;

  get lastPinAt() {
    return this.lastPinTimestamp ? new Date(this.lastPinTimestamp) : null;
  }

  get lastMessageId() {
    return this.revoltChannel.last_message_id;
  }

  messages = new MessageManager(this, false);

  async send(content: string | MessageOptions): Promise<Message> {
    const convertedParams = await msgParamsConverter(content, this.revoltChannel.client);

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
