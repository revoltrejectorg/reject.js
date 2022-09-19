import { Emoji as revoltEmoji } from "revolt.js";
import { Emoji } from "./Emoji";
import { MessageReaction } from "./MessageReaction";

export class ReactionEmoji extends Emoji {
  reaction: MessageReaction;

  constructor(reaction: MessageReaction, emoji: revoltEmoji) {
    super(reaction.message.client, emoji);

    this.reaction = reaction;
  }

  valueOf() {
    return this.id;
  }
}
