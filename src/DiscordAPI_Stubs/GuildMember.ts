import { Member as revoltMember } from "revolt.js/dist/maps/Members";
import { UserMention as DiscordUserMention } from "discord.js";
import { baseClass } from "./Base";
import { User } from "./User";
import { Guild } from "./Guild";
import { Collection } from "./DiscordJS_Stubs";
import { Client } from "./Client";

export class GuildMember extends baseClass {
  private revoltMember: revoltMember;

  get avatar() { return this.revoltMember.avatar; }

  // TODO: add polyfills here
  readonly bannable = false;

  // FIXME: Revolt doesn't implement these classes.
  communicationDisabledUntil = new Date();

  communicationDisabledUntilTimestamp = new Date();

  deleted = false;

  get displayColor() { return 0; }

  /** 99% sure this will exist some day */
  get displayHexColor() { return "#000000"; }

  get displayName() { return this.nickname; }

  get guild() {
    if (!this.revoltMember.server) return;
    return new Guild(this.revoltMember.server);
  }

  get id() { return this.user?.id; }

  // FIXME: Revolt doesn't implement these classes.
  readonly joinedAt = new Date();

  joinedTimestamp = new Date();

  readonly kickable: boolean = false;

  readonly manageable: boolean = false;

  get nickname() { return this.revoltMember.nickname; }

  get partial() {
    return this.joinedTimestamp === null;
  }

  pending = false;

  // TODO: polyfill this
  get permissions() {
    return new Collection<string, boolean>();
  }

  readonly premiumSince: Date = new Date();

  get presence() { return this.revoltMember.user?.status?.presence; }

  get roles() { return this.revoltMember.roles; }

  get user() {
    if (this.revoltMember.user) return new User(this.revoltMember.user);
    return undefined;
  }

  // TODO: also add a polyfill for this. insert pls help idk how voicechat api works.
  readonly voice = undefined;

  constructor(member: revoltMember) {
    super(new Client(member.client));
    this.revoltMember = member;
  }

  /** FIXME: missing ban reason */
  async ban() {
    if (!this.id) return;
    this.revoltMember.server?.banUser(this.id, { reason: "Banned by discord.js" });
  }

  toString(): DiscordUserMention {
    return `<@${this.id}>`;
  }

  createDM(force = false) {
    return this.user?.createDM(force);
  }

  deleteDM() {
    return this.user?.deleteDM();
  }
}
