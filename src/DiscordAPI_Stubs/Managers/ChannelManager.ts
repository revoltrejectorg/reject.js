import { ChannelType, Events } from "discord.js";
import { Server, Channel as RevoltChannel } from "revolt.js";
import { createChannelfromRevolt } from "../../Utils/DiscordAPI";
import { BaseChannel, Channel } from "../Channels";
import { Client } from "../Client";
import { Guild } from "../Guild";
import { Snowflake } from "../types";
import { CachedManager } from "./CachedManager";

export class ChannelManager extends CachedManager<Channel> {
  constructor(client: Client, iterable = false) {
    super(client, BaseChannel as any, iterable);
  }

  // @ts-ignore - silence
  _add(
    data: RevoltChannel,
    guild?: Guild,
    { cache = true, allowUnknownGuild = false, fromInteraction = false } = {},
  ) {
    const existing = this.cache.get(data._id);
    if (existing) {
      if (existing.type !== ChannelType.DM) guild?.channels?._add(existing);
      return existing;
    }

    const channel = createChannelfromRevolt(data, this.client);
    if (!channel) {
      this.client.emit(Events.Debug, "Failed to create channel");
      return null;
    }

    if (cache && !allowUnknownGuild) this.cache.set(channel.id, channel);

    return channel;
  }

  _remove(id: Snowflake) {
    const channel = this.cache.get(id);
    if (channel?.type !== ChannelType.GuildText) return;

    channel?.guild?.channels.cache.delete(id);

    this.cache.delete(id);
  }

  async fetch(id: Snowflake, { allowUnknownGuild = false, cache = true, force = false } = {}) {
    if (!force) {
      const existing = this.cache.get(id);
      if (existing && !existing.partial) return existing;
    }

    const data = this.revoltClient.channels.get(id);
    if (!data) return;

    const guild = data.server ? new Guild(data.server, this.client) : undefined;

    return this._add(data, guild);
  }
}
