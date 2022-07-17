import { Collection } from "../DiscordJS_Stubs";
import { Guild } from "../Guild";
import { GuildEmoji } from "../structures";
import { BaseGuildEmojiManager } from "./BaseGuildEmojiManager";

export class GuildEmojiManager extends BaseGuildEmojiManager {
  protected guild: Guild;

  protected emojis: GuildEmoji[];

  constructor(guild: Guild, iterable: boolean) {
    super(guild.rejectClient.revoltClient, iterable);

    this.guild = guild;

    const revoltEmojis = [...guild.rejectClient.revoltClient.emojis.values()].filter(
      (x) => (x.parent.type === "Server" ? x.parent.id === guild.id : false),
    );

    this.emojis = revoltEmojis.map((emoji) => new GuildEmoji(this.client, emoji, guild));

    this.emojis.forEach((emoji) => {
      this._add(emoji, true);
    });
  }

  _add(data: any, cache?: boolean) {
    return super._add(data, cache, { extras: [this.guild] });
  }

  // FIXME
  async create() {

  }

  async fetch(id: string, { cache = true, force = false } = {}) {
    if (id) {
      if (!force) {
        const existing = this.cache.get(id);
        if (existing) return existing;
      }
      const data = await this.revoltClient.api.get(`/servers/${this.guild.id}/emojis`);
      const emojis: Collection<string, GuildEmoji> = new Collection();
      Object.values(data).forEach((emoji) => {});
      return emojis;
    }
  }
}
