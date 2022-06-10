import { Member as revoltMember } from "revolt.js";
import {
  BanOptions,
  GuildMemberEditData,
  ImageURLOptions,
  MessageOptions,
  UserMention as DiscordUserMention,
} from "discord.js";
import { baseClass } from "./Base";
import { User } from "./User";
import { Guild } from "./Guild";
import { Collection } from "./DiscordJS_Stubs";
import { Client } from "./Client";
import { hexToRgb } from "../Utils";

/**
 * @see https://discord.js.org/#/docs/discord.js/13.8.0/class/GuildMember
 */
export class GuildMember extends baseClass {
  private revoltMember: revoltMember;

  // FIXME: avatar hash is all screwy
  get avatar() { return this.revoltMember.avatar?._id; }

  get bannable() {
    return this.revoltMember.bannable;
  }

  // Revolt doesn't support this
  readonly communicationDisabledUntil?: Date;

  communicationDisabledUntilTimestamp?: number;

  deleted = false;

  get displayColor() {
    return hexToRgb(this.displayHexColor);
  }

  get displayHexColor() {
    let color: string = "#000000";

    if (this.revoltMember.roles && this.revoltMember.roles.length > 0) {
      const srv = this.revoltMember.server;
      if (srv?.roles) {
        this.revoltMember.roles.forEach((role) => {
          // bri'ish spelling
          const c = srv.roles![role]?.colour;
          if (c) {
            color = c;
            return;
          }
        });
      }
    }

    return color;
  }

  get displayName() { return this.nickname; }

  get guild() {
    if (!this.revoltMember.server) return;
    return new Guild(this.revoltMember.server);
  }

  get id() { return this.user?.id; }

  get kickable() {
    return this.revoltMember.kickable;
  }

  // FIXME: Revolt doesn't implement these classes.
  readonly joinedAt = new Date();

  joinedTimestamp = 0;

  get manageable() {
    return this.revoltMember.inferior;
  }

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
    if (!this.revoltMember.user) return;
    return new User(this.revoltMember.user);
  }

  // TODO: also add a polyfill for this. insert pls help idk how voicechat api works.
  readonly voice = undefined;

  constructor(member: revoltMember) {
    super(new Client(member.client));
    this.revoltMember = member;
  }

  avatarURL(options: ImageURLOptions) {
    return this.user?.avatarURL(options);
  }

  async ban(options?: BanOptions) {
    // FIXME: may need to throw error to preserve original discord.js behavior
    if (!this.id || !this.revoltMember.bannable) return;
    this.revoltMember.server?.banUser(this.id, {
      reason: options?.reason,
    });
  }

  // FIXME
  async disableCommunicationUntil() {
    return null;
  }

  displayAvatarURL(options: ImageURLOptions) {
    return this.user?.displayAvatarURL(options);
  }

  // FIXME
  async edit(data: GuildMemberEditData, reason?: string) {
    this.revoltMember.edit({
      nickname: data.nick,
    });
  }

  equals(member: GuildMember) {
    return (
      member instanceof this.constructor
      && this.id === member.id
      && this.partial === member.partial
      && this.guild?.id === member.guild?.id
      && this.joinedTimestamp === member.joinedTimestamp
      && this.nickname === member.nickname
      && this.avatar === member.avatar
      && this.pending === member.pending
      && this.communicationDisabledUntilTimestamp === member.communicationDisabledUntilTimestamp
      // && (this._roles === member._roles
    // eslint-disable-next-line max-len
    // || (this._roles.length === member._roles.length && this._roles.every((role, i) => role === member._roles[i])))
    );
  }

  isCommunicationDisabled() {
    return false;
  }

  async setNickname(name?: string, reason?: string) {
    this.edit({
      nick: name,
    }, reason);
  }

  // FIXME
  async timeout(timeout: number, reason?: string) {
    return this;
  }

  async kick(reason?: string) {
    // FIXME: see ban() fixme
    if (!this.revoltMember.kickable) return;
    this.revoltMember.kick();
  }

  send(content: string | MessageOptions) {
    return this.user?.send(content);
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
