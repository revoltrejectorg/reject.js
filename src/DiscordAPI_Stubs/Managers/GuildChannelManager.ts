import { BaseGuildTextChannel, GuildChannel, VoiceChannel } from "../Channels";
import { Guild } from "../Guild";
import { CachedManager } from "./CachedManager";

export class GuildChannelManager extends CachedManager {
  constructor(guild: Guild, iterable = false) {
    super(guild.client.revoltClient, GuildChannel, iterable);

    guild.revoltServer.channels.forEach((channel) => {
      if (!channel) return;

      // eslint-disable-next-line no-nested-ternary
      const guildChannel = channel.channel_type === "TextChannel" ? new BaseGuildTextChannel(channel)
        : channel.channel_type === "VoiceChannel" ? new VoiceChannel(channel)
          : new GuildChannel(channel);

      this._add(guildChannel, true, { id: guildChannel.id });
    });
  }
}
