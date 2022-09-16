import { ChannelType } from "discord.js";
import { createChannelfromRevolt } from "../../Utils/DiscordAPI";
import { GuildChannel } from "../Channels";
import { Guild } from "../Guild";
import { CachedManager } from "./CachedManager";

export class GuildChannelManager extends CachedManager<GuildChannel> {
  constructor(guild: Guild, iterable = false) {
    super(guild.client.revoltClient, GuildChannel as any, iterable);

    guild.revoltServer.channels.forEach((channel) => {
      if (!channel) return;

      const guildChannel = createChannelfromRevolt(channel);

      if (guildChannel.type === ChannelType.DM) return;

      this._add(guildChannel);
    });
  }

  _add(channel: GuildChannel) {
    const existing = this.cache.get(channel.id);
    if (existing) return existing;
    this.cache.set(channel.id, channel);
    return channel;
  }
}
