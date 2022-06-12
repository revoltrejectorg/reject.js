/* eslint-disable no-bitwise */
import { Channel as revoltChannel, Server as revoltServer } from "revolt.js";
import { BanOptions, BaseGuild as discordBaseGuild } from "discord.js";
import { baseClass, RejectBase } from "./Base";
import { GuildMember } from "./GuildMember";
import { Channel } from "./Channels";
import { Client } from "./Client";

export class GuildMemberManager extends RejectBase {
  private revoltMembers: Array<GuildMember>;

  constructor(members: Array<GuildMember>) {
    super();
    this.revoltMembers = members;
  }

  // FIXME: make this NOT use the any type
  async ban(user: any, options: BanOptions) {
    const member = this.revoltMembers.find((m) => m.user?.id === user.id);
    if (!member) throw new Error("User not in guild");
    member.ban();
  }
}

/** Base for guild-type classes
 * reference https://discord.js.org/#/docs/discord.js/stable/class/BaseGuild
*/
export class BaseGuild extends baseClass implements discordBaseGuild {
  protected revoltServer: revoltServer;

  get createdAt() { return new Date(this.revoltServer.createdAt); }

  get createdTimestamp() { return this.revoltServer.createdAt; }

  get description() { return this.revoltServer.description; }

  readonly features = [];

  get icon() { return this.revoltServer.generateIconURL() ?? "https://FIXME"; }

  get id() { return this.revoltServer._id; }

  get name() { return this.revoltServer.name; }

  get nameAcronym() { return this.name.split(" ").map((word) => word[0]).join(""); }

  nsfwLevel = "DEFAULT";

  get verified() {
    if (!this.revoltServer.flags) return false;

    return !!(this.revoltServer.flags & 1
      || this.revoltServer.flags & 2
    );
  }

  // discord.js duplicate
  get partnered() {
    return this.verified;
  }

  iconURL() {
    return this.icon;
  }

  toString(): string {
    return this.name;
  }

  valueOf(): string {
    return "FIXME";
  }

  constructor(rServer: revoltServer) {
    super(new Client(rServer.client));
    this.revoltServer = rServer;
  }
}

/**
 * @see https://discord.js.org/#/docs/discord.js/stable/class/Guild
 */
export class Guild extends BaseGuild {
  /** None of these types have a revolt equivalent. */
  readonly afkChannel?: revoltChannel;

  readonly afkChannelId?: string;

  readonly afkTimeout?: number;

  /**
   * FIXME: applicationId is not available in the API, so this is a placeholder
  */
  get applicationId() { return this.revoltServer.client.user?._id; }

  // TODO: Implement
  readonly approximateMemberCount?: number = 0;

  readonly approximatePresenceCount?: number = 0;

  available = true;

  get banner() { return this.revoltServer.generateBannerURL() ?? null; }

  get bans() { return this.revoltServer.fetchBans(); }

  get channels() {
    const channels: ReadonlyArray<Channel> = (() => {
      const channelsArray: Channel[] = [];
      this.revoltServer.channels.forEach((channel) => {
        if (!channel) return;
        channelsArray.push(new Channel(channel));
      });
      return channelsArray;
    })();
    return channels;
  }

  /** FIXME: missing stub GuildApplicationCommandManager */
  readonly commands = [];

  DefaultMessageNotificationLevel = "ALL_MESSAGES";

  readonly deleted = false;

  get discoverySplash() { return this.revoltServer.generateBannerURL(); }

  /** FIXME: need to retrieve emojis from server */
  readonly emojis = [];

  readonly explicitContentFilter = "DISABLED";

  get invites() { return this.revoltServer.fetchInvites(); }

  /** FIXME: no info available for when a user joined a server */
  get joinedAt() { return new Date(this.revoltServer.client.user?.createdAt ?? 0); }

  get joinedTimestamp() { return this.revoltServer.client.user?.createdAt; }

  get large() { return this.revoltServer.fetchMembers(); }

  maximumBitrate = 96000;

  maximumMembers = 2 ** 53;

  readonly maximumPresences = 2 ** 53;

  get me() { return this.client.user; }

  /** FIXME: cant get member count without interrupting stuff */
  memberCount = 0;

  get members() {
    const rejectMembers: GuildMember[] = [];
    this.revoltServer.fetchMembers().then((members) => {
      members.members.forEach((member) => {
        rejectMembers.push(new GuildMember(member));
      });
    });

    return new GuildMemberManager(rejectMembers);
  }

  mfaLevel = "NONE";

  get ownerId() { return this.revoltServer.owner; }

  // FIXME: revolt will likely support this in the future, watch for updates.
  preferredLocale?: string;

  premiumProgressBarEnabled = false;

  premiumSubscriptionCount = 0;

  premiumTier = "NONE";

  presences = [];

  readonly publicUpdatesChannelId?: string;

  /** FIXME: No roles class */
  get roles() { return this.revoltServer.roles; }

  rulesChannelId?: string;

  scheduledEvents = [];

  /** FIXME: can't figure out how to get shard, insert pls fix */
  shard = 0;

  shardId = 0;

  get splash() { return this.revoltServer.generateBannerURL(); }

  stageInstances = [];

  stickers = [];

  /** FIXME: SystemChannel isn't implemented correctly AT ALL, and is mainly to stop
     * bots from crashing when they try to use it.
     */
  get systemChannel() { return this.revoltServer.system_messages; }

  systemChannelFlags = 0;

  systemChannelId?: string;

  /** FIXME: Probably coming in a future update. */
  vanityURLCode?: string;

  verificationLevel = "NONE";
}
