import { Message } from "../Message";
import { MessageReaction } from "../structures";
import { CachedManager } from "./CachedManager";

export class ReactionManager extends CachedManager<MessageReaction> {
  message: Message;

  constructor(message: Message, iterable = false) {
    super(message.client.revoltClient, MessageReaction as any, iterable);

    this.message = message;
  }

  _add(data: MessageReaction, cache: boolean) {
    return super._add(
      data,
      cache,
      { id: data.emoji.id ?? data.emoji.name, extras: [this.message] },
    );
  }

  async removeAll() {
    await this.message.revoltMsg.clearReactions();
    return this.message;
  }
}
