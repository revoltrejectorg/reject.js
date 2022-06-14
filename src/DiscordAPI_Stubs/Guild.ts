/* eslint-disable no-bitwise */
import { Channel as revoltChannel, Server as revoltServer } from "revolt.js";
import { BanOptions, BaseGuild as discordBaseGuild, ImageURLOptions } from "discord.js";
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
 * @see https://discord.js.org/#/docs/discord.js/stable/class/BaseGuild
*/
export class BaseGuild extends baseClass {
  protected revoltServer: revoltServer;

  get createdAt() { return new Date(this.revoltServer.createdAt); }

  get createdTimestamp() { return this.revoltServer.createdAt; }

  readonly features = [];

  get icon() { return this.revoltServer.icon ?? "0"; }

  get id() { return this.revoltServer._id; }

  get name() { return this.revoltServer.name; }

  get nameAcronym() { return this.name.split(" ").map((word) => word[0]).join(""); }

  get verified() {
    if (!this.revoltServer.flags) return false;

    /**
     * Plain english:
     * If a server has a flag of 1, it is an official Revolt server.
     * If a server has a flag of 2, it is a verified server.
    */
    return !!(this.revoltServer.flags & 1
      || this.revoltServer.flags & 2
    );
  }

  // discord.js duplicate
  get partnered() {
    return this.verified;
  }

  iconURL(options?: ImageURLOptions) {
    return this.revoltServer.generateIconURL({
      size: options?.size,
    });
  }

  toString(): string {
    return this.name;
  }

  constructor(rServer: revoltServer) {
    super(new Client(rServer.client));
    this.revoltServer = rServer;
  }
}

/**
 * @see https://discord.js.org/#/docs/discord.js/13.8.0/class/AnonymousGuild
 */
export class AnonymousGuild extends BaseGuild {
  get banner() {
    return this.revoltServer.banner;
  }

  get description() {
    return this.revoltServer.description;
  }

  get splash() {
    return this.splashURL();
  }

  nsfwLevel = "DEFAULT";

  // FIXME: Probably coming soon.
  vanityURLCode?: string;

  verificationLevel = "NONE";

  premiumSubscriptionCount = 0;

  bannerURL(options?: ImageURLOptions) {
    return this.revoltServer.generateBannerURL({
      size: options?.size,
    });
  }

  // FIXME: stub - revolt has no invite splashes
  splashURL(options?: ImageURLOptions) {
    return this.bannerURL(options);
  }
}

/**
 * @see https://discord.js.org/#/docs/discord.js/stable/class/Guild
 */
export class Guild extends AnonymousGuild {
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

  get discoverySplash() {
    return this.bannerURL();
  }

  /** FIXME: need to retrieve emojis from server */
  readonly emojis = [];

  readonly explicitContentFilter = "DISABLED";

  get invites() { return this.revoltServer.fetchInvites(); }

  // FIXME: No info about when a user joined the server
  get joinedAt() { return new Date(this.revoltServer.client.user?.createdAt ?? 0); }

  get joinedTimestamp() { return this.revoltServer.client.user?.createdAt; }

  get large() { return this.revoltServer.fetchMembers(); }

  maximumBitrate = 96000;

  maximumMembers = Infinity;

  readonly maximumPresences = Infinity;

  get me() {
    if (!this.revoltServer.member) return;
    return new GuildMember(this.revoltServer.member);
  }

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

  stageInstances = [];

  stickers = [];

  /** FIXME: SystemChannel isn't implemented correctly AT ALL, and is mainly to stop
     * bots from crashing when they try to use it.
     */
  get systemChannel() { return this.revoltServer.system_messages; }

  systemChannelFlags = 0;

  systemChannelId?: string;
}
