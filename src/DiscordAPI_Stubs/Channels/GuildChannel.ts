import { Channel as revoltChannel } from "revolt.js";
import { Guild } from "../Guild";
import { Channel } from "./Channel";

export class GuildChannel extends Channel {
  get deletable() {
    return this.managable
    && this.guild?.rulesChannelId !== this.id
    && this.guild?.publicUpdatesChannelId !== this.id;
  }

  guild?: Guild;

  get guildid() { return this.guild?.id ?? "0"; }

  get managable() {
    return this.guild?.me?.permissions?.has("MANAGE_CHANNELS") ?? false;
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

  constructor(channel: revoltChannel) {
    super(channel);
    if (channel.server) { this.guild = new Guild(channel.server); }
  }

  async clone() {
    throw new Error("Method not implemented.");
  }
}
