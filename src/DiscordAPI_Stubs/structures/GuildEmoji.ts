import { GuildEmojiEditData, PermissionFlagsBits } from "discord.js";
import { User } from "../User";
import { BaseGuildEmoji } from "./BaseGuildEmoji";

export class GuildEmoji extends BaseGuildEmoji {
  _roles: string[] = [];

  get author() {
    if (!this.rEmoji.creator) return null;
    return new User(this.rEmoji.creator, this.rejectClient);
  }

  get deletable() {
    return this.guild.me?.permissions?.has("ManageEmojisAndStickers");
  }

  // FIXME
  roles = null;

  async delete(reason?: string) {
    await this.rEmoji.delete();

    return this;
  }

  // FIXME
  async edit(data: GuildEmojiEditData) {
    return this;
  }

  equals(otherEmoji: GuildEmoji | BaseGuildEmoji) {
    if (otherEmoji instanceof GuildEmoji) {
      return (
        otherEmoji.id === this.id
        && otherEmoji.name === this.name
        && otherEmoji.managed === this.managed
        && otherEmoji.available === this.available
        && otherEmoji.requiresColons === this.requiresColons
        && otherEmoji.roles === this.roles
      );
    }

    return (
      otherEmoji.id === this.id
      && otherEmoji.name === this.name
    );
  }

  /**
   * Don't see why we need a seperate call for the name when .edit() is available.
  */
  async setName(name: string, reason?: string) {
    return this.edit({ name });
  }
}
