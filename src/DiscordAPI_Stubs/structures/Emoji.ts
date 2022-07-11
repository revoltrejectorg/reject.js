import { Emoji as revoltEmoji } from "revolt.js";
import { baseClass } from "../Base";
import { Client } from "../Client";

export class Emoji extends baseClass {
  protected rEmoji: revoltEmoji;

  get animated() {
    return this.rEmoji.animated;
  }

  get name() {
    return this.rEmoji.name;
  }

  get id() {
    return this.rEmoji._id;
  }

  get identifier() {
    if (this.id) return `${this.animated ? "a:" : ""}${this.name}:${this.id}`;
    return this.name;
  }

  get url() {
    return this.rEmoji.imageURL;
  }

  get createdTimestamp() {
    return this.rEmoji.createdAt;
  }

  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  constructor(client: Client, rEmoji: revoltEmoji) {
    super(client);

    this.rEmoji = rEmoji;
  }

  toString() {
    return this.id ? `:${this.id}:` : this.name;
  }

  toJSON() {
    return super.toJSON({
      guild: "guildId",
      createdTimestamp: true,
      url: true,
      identifier: true,
    });
  }
}
