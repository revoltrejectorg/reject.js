import { Emoji as rEmoji } from "revolt.js";
import { baseClass } from "../Base";
import { Message } from "../Message";
import { ReactionEmoji } from "./ReactionEmoji";

export type MessageReactionData = {
  emoji: rEmoji;
}

// FIXME: very badly implemented
export class MessageReaction extends baseClass {
  _emoji: ReactionEmoji;

  message: Message;

  // FIXME
  me = false;

  count = 0;

  constructor(message: Message, data: MessageReactionData) {
    super(message.client);

    this.message = message;

    this._emoji = new ReactionEmoji(this, data.emoji);
  }

  react() {
    return this.message.react(this.emoji.id);
  }

  async remove() {
    await this.message.revoltMsg.unreact(this.emoji.id);
    return this;
  }

  get emoji() {
    return this._emoji;
  }
}
