/* eslint-disable no-bitwise */
import { Channel as revoltChannel, Server as revoltServer } from "revolt.js";
import { GuildEditData, ImageURLOptions } from "discord.js";
import { baseClass } from "./Base";
import { GuildMember } from "./GuildMember";
import { Channel } from "./Channels";
import { Client } from "./Client";
import { GuildChannelManager, GuildEmojiManager, GuildMemberManager } from "./Managers";

/** Base for guild-type classes
 * @see https://discord.js.org/#/docs/discord.js/stable/class/BaseGuild
*/
export class BaseGuild extends baseClass {
  revoltServer: revoltServer;

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
    return new GuildChannelManager(this, false);
  }

  /** FIXME: missing stub GuildApplicationCommandManager */
  readonly commands = [];

  DefaultMessageNotificationLevel = "ALL_MESSAGES";

  readonly deleted = false;

  get discoverySplash() {
    return this.bannerURL();
  }

  get emojis() {
    return new GuildEmojiManager(this, false);
  }

  readonly explicitContentFilter = "DISABLED";

  get invites() { return this.revoltServer.fetchInvites(); }

  // FIXME: No info about when a user joined the server
  get joinedAt() { return new Date(this.revoltServer.client.user?.createdAt ?? 0); }

  get joinedTimestamp() { return this.revoltServer.client.user?.createdAt; }

  get large() { return this.revoltServer.fetchMembers(); }

  maximumBitrate = 96000;

  maximumMembers = Infinity;

  readonly maximumPresences = Infinity;

  /**
   * Deprecated since v14 but its way more efficient to implement it here.
  */
  get me() {
    if (!this.revoltServer.member) return;
    return new GuildMember(this.revoltServer.member);
  }

  /** FIXME: cant get member count without interrupting stuff */
  memberCount = 0;

  // FIXME: stupid idiot hack
  private _members?: GuildMemberManager;

  get members() {
    if (!this._members) {
      this._members = new GuildMemberManager(this);
    }

    return this._members;
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

  /**
   * FIXME: SystemChannel isn't implemented correctly AT ALL, and is mainly to stop
   * bots from crashing when they try to use it.
  */
  get systemChannel() { return this.revoltServer.system_messages; }

  systemChannelFlags = 0;

  systemChannelId?: string;

  async delete() {
    return this.revoltServer.delete();
  }

  discoverySplashURL(options: ImageURLOptions) {
    return this.bannerURL(options);
  }

  async edit(data: GuildEditData, reason?: string) {
    this.revoltServer.edit({
      name: data.name,
      description: data.description,
    });

    return this;
  }

  setIcon(icon: any, reason?: string) {
    return this.revoltServer.edit({ icon });
  }

  setName(name: string, reason?: string) {
    return this.revoltServer.edit({ name });
  }

  // FIXME
  setOwner(user: GuildMember, reason?: string) {
    return this.edit({});
  }

  setPreferredLocale(preferredLocale: string, reason?: string) {
    return this.edit({ preferredLocale }, reason);
  }

  get voiceAdapterCreator() {
    return (methods: any) => {
      this.client.voice.adapters.set(this.id, methods);
      return {
        // FIXME
        sendPayload: (data: any) => true,
        destroy: () => {
          this.client.voice.adapters.delete(this.id);
        },
      };
    };
  }
}
