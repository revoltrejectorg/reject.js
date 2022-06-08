import {
  ClientPresence,
  ImageURLOptions,
  PresenceData,
  UserMention as DiscordUserMention,
  MessageOptions,
  User as DiscordUser,
} from "discord.js";
import { User as revoltUser } from "revolt.js/dist/maps/Users";
import { APIUser } from "discord-api-types/v10";
import { toDiscordStatus, toRevoltStatus } from "../Utils/DiscordAPI";
import { fixme } from "../Utils";
import { baseClass } from "./Base";
import { DMChannel } from "./Channels";
import { Client } from "./Client";

/**
 * reference https://discord.js.org/#/docs/discord.js/stable/class/User
 */
export class User extends baseClass {
  private revoltUser: revoltUser;

  get accentColor() { return undefined; }

  // FIXME: incorrect impl.
  get avatar() { return this.revoltUser.avatar as any; }

  banner = undefined;

  bannerURL() {
    return "https://FIXME";
  }

  get bot() {
    if (this.revoltUser.bot) return true;
    return false;
  }

  get createdAt() { return new Date(this.revoltUser.createdAt); }

  get createdTimestamp() { return this.revoltUser.createdAt; }

  get defaultAvatarURL() { return this.revoltUser.defaultAvatarURL; }

  discriminator: string = "#0000";

  /** FIXME: Unimplemented features */
  dmChannel = null;

  flags = null;

  hexAccentColor?: never;

  get id() { return this.revoltUser._id; }

  get partial() {
    return (typeof this.username !== "string") as false;
  }

  get presence(): ClientPresence {
    const usrCls = this;
    return {
      status: toDiscordStatus(this.revoltUser.status),
      activities: [],
      clientStatus: {
        desktop: "online",
      },
      /// FIXME: what is this even for?
      _parse(data: PresenceData) {
        return data;
      },

      set(presence: PresenceData) {
        // FIXME: partial impl
        if (presence.activities) {
          usrCls.revoltUser.client.users.edit({
            status: {
              ...usrCls.revoltUser.status,
              text: presence.activities[0]?.name,
            },
          }).catch(() => fixme("Error setting status"));
        }

        if (usrCls.revoltUser.status?.presence) {
          usrCls.revoltUser.status.presence = toRevoltStatus(presence.status);
        }

        return this;
      },
    } as unknown as ClientPresence;
  }

  system = false;

  /** FIXME: Improper tag impl. */
  get tag() { return this.discriminator; }

  get username() { return this.revoltUser.username; }

  constructor(rUser: revoltUser) {
    super(new Client(rUser.client));
    this.revoltUser = rUser;
  }

  avatarURL(options: ImageURLOptions) {
    return this.revoltUser.generateAvatarURL({
      size: options.size,
    });
  }

  displayAvatarURL(options: ImageURLOptions) {
    return this.revoltUser.generateAvatarURL(options);
  }

  async send(content: string | MessageOptions) {
    const ch = await this.createDM();
    const msg = await ch!.send(content);

    return msg;
  }

  async createDM(force = false) {
    const dm = await this.revoltUser.openDM();
    return new DMChannel(dm);
  }

  // FIXME: stub
  async deleteDM() {
    const dm = await this.revoltUser.openDM();

    return new DMChannel(dm);
  }

  // FIXME: Need APIUser stub
  private _equals(user: APIUser): boolean {
    return (
      user
      && this.id === user.id
      && this.username === user.username
      && this.discriminator === user.discriminator
      && this.avatar === user.avatar
      && this.flags === user.public_flags
      && ("banner" in user ? this.banner === user.banner : true)
      && ("accent_color" in user ? this.accentColor === user.accent_color : true)
    );
  }

  // FIXME: stub
  equals(user: User) {
    return (
      user
      && this.id === user.id
      && this.username === user.username
      && this.discriminator === user.discriminator
      && this.avatar === user.avatar
      && this.flags === user.flags
      && this.banner === user.banner
      && this.accentColor === user.accentColor
    );
  }

  toString(): DiscordUserMention {
    return `<@${this.id}>`;
  }
}
