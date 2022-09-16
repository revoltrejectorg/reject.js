import { MessageOptions } from "discord.js";
import { msgParamsConverter } from "../../Utils/DiscordAPI";
import { MessageManager } from "../Managers";
import { Message } from "../Message";
import { BaseChannel } from "./BaseChannel";

export class TextBasedChannel extends BaseChannel {
  messages = new MessageManager(this, false);

  lastPinTimestamp = 0;

  get lastPinAt() {
    return this.lastPinTimestamp ? new Date(this.lastPinTimestamp) : null;
  }

  get lastMessage() {
    if (!this.revoltChannel.last_message) return;
    return new Message(this.revoltChannel.last_message);
  }

  get lastMessageId() {
    return this.revoltChannel.last_message_id;
  }

  async send(content: string | MessageOptions): Promise<Message> {
    const convertedParams = await msgParamsConverter(content, this.revoltChannel.client);

    const msg = await this.revoltChannel.sendMessage(convertedParams);
    this._stopTyping();

    return new Message(msg);
  }

  async sendTyping(timeout: number = 5000) {
    // TODO: stop typing when we send a message
    this.revoltChannel.startTyping();
    setTimeout(() => {
      this.revoltChannel.stopTyping();
    }, timeout);
  }

  protected async _stopTyping() {
    this.revoltChannel.stopTyping();
  }

  static applyToClass<T extends Object>(structure: T, full = false, ignore: string[] = []) {
    const props = ["send"];
    if (full) {
      props.push(
        "lastMessage",
        "lastPinAt",
        "bulkDelete",
        "sendTyping",
        "createMessageCollector",
        "awaitMessages",
        "createMessageComponentCollector",
        "awaitMessageComponent",
        "fetchWebhooks",
        "createWebhook",
        "setRateLimitPerUser",
        "setNSFW",
      );
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const prop of props) {
      // eslint-disable-next-line no-continue
      if (ignore.includes(prop)) continue;
      Object.defineProperty(
        (structure as any).prototype,
        prop,
        Object.getOwnPropertyDescriptor(TextBasedChannel.prototype, prop)!,
      );
    }
  }
}
