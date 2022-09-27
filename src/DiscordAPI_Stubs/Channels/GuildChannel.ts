import { ChannelType, TextBasedChannelTypes } from "discord.js";
import { Channel as revoltChannel } from "revolt.js";
import { Client } from "../Client";
import { Guild } from "../Guild";
import { BaseChannel } from "./BaseChannel";

export class GuildChannel extends BaseChannel {
  declare type: Exclude<TextBasedChannelTypes, ChannelType.DM | ChannelType.GroupDM>;

  get deletable() {
    return this.managable
    && this.guild?.rulesChannelId !== this.id
    && this.guild?.publicUpdatesChannelId !== this.id;
  }

  guild: Guild;

  get guildid() { return this.guild?.id ?? "0"; }

  get managable() {
    return this.guild?.me?.permissions?.has("ManageChannels") ?? false;
  }

  /** FIXME: improper members stub */
  readonly members = [];

  get name() { return this.revoltChannel.name; }

  /** FIXME: cant get category for this channel */
  readonly parent?: any;

  parentId?: string;

  position = 0;

  rawPosition = 0;

  readonly viewable = true;

  constructor(channel: revoltChannel, client: Client) {
    if (!channel.server) throw new Error("Expected channel to have server");
    super(channel, client);

    this.guild = new Guild(channel.server, client);
  }
}
