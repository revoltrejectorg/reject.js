import { Channel as revoltChannel } from "revolt.js";
import { Reject as rejectDiscordAPI } from "../../Utils/DiscordAPI/DiscordParamsConverter";
import { Guild } from "../Guild";
import { Channel } from "./Channel";

export class GuildChannel extends Channel {
  /** FIXME: Revolt.js needs perms api */
  readonly deletable = true;

  guild?: Guild;

  get guildid() { return this.guild?.id ?? "0"; }

  readonly managable = true;

  /** FIXME: improper members stub */
  readonly members = [];

  get name() { return this.revoltChannel.name; }

  /** FIXME: cant get category for this channel */
  readonly parent?: any;

  parentId?: string;

  position = 0;

  rawPosition = 0;

  /**  FIXME: not all equivs can be added */
  // @ts-ignore
  get type() {
    return rejectDiscordAPI
      .Utils
      .DiscordAPI
      .ChannelTypeConverter(this.revoltChannel.channel_type);
  }

  readonly viewable = true;

  constructor(channel: revoltChannel) {
    super(channel);
    if (channel.server) { this.guild = new Guild(channel.server); }
  }

  async clone() {
    throw new Error("Method not implemented.");
  }
}
