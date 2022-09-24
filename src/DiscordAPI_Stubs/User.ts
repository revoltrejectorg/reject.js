import {
  ClientPresence,
  ImageURLOptions,
  PresenceData,
  UserMention as DiscordUserMention,
  BaseMessageOptions,
} from "discord.js";
import { API, User as revoltUser } from "revolt.js";
import { statusConvert } from "../Utils/DiscordAPI";
import { fixme, rgbToHex } from "../Utils";
import { baseClass } from "./Base";
import { DMChannel } from "./Channels";
import { Client } from "./Client";

/**
 * @see https://discord.js.org/#/docs/discord.js/stable/class/User
 */
export class User extends baseClass {
  private revoltUser: revoltUser;

  accentColor = 0xff0000;

  // FIXME: incorrect impl.
  get avatar() { return this.revoltUser.avatar; }

  banner = undefined;

  bannerURL() {
    return "https://FIXME";
  }

  get bot() {
    return !!(this.revoltUser.bot);
  }

  get createdAt() { return new Date(this.revoltUser.createdAt); }

  get createdTimestamp() { return this.revoltUser.createdAt; }

  get defaultAvatarURL() { return this.revoltUser.defaultAvatarURL; }

  discriminator: string = "#0000";

  // FIXME: stub
  get dmChannel() {
    return this.createDM();
  }

  get flags() {
    return this.revoltUser.flags;
  }

  readonly hexAccentColor = rgbToHex(this.accentColor);

  get id() { return this.revoltUser._id; }

  get partial() {
    return (typeof this.username !== "string") as false;
  }

  get presence(): ClientPresence {
    const activityStatus = statusConvert(this.revoltUser.status?.presence, false);

    // FIXME: Why does this have to be so garbage?
    const discordPresence: ClientPresence = {
      status: activityStatus,
      activities: [],
      clientStatus: {
        // make sure status isn't invisible or offline
        desktop: activityStatus !== "invisible" && activityStatus !== "offline"
          ? activityStatus : "online",
      },

      /// FIXME: what is this even for?
      _parse: (data: PresenceData) => ({
        user: this as any,
        // FIXME
        guild_id: "0",
        status: activityStatus,
        activities: discordPresence.activities,
        client_status: discordPresence.clientStatus,
      }),

      set: (presence: PresenceData) => {
        // FIXME: partial impl
        if (presence.activities) {
          this.revoltUser.client.users.edit({
            status: {
              ...this.revoltUser.status,
              text: presence.activities[0]?.name,
              presence: statusConvert(presence.status, true) as API.UserStatus["presence"],
            },
          }).catch(() => fixme("Error setting status"));
        }

        return discordPresence;
      },
    } as any;

    return discordPresence;
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

  async send(content: string | BaseMessageOptions) {
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
  private _equals(user: User): boolean {
    return (
      user
      && this.id === user.id
      && this.username === user.username
      && this.discriminator === user.discriminator
      && this.avatar === user.avatar
      // && this.flags === user.public_flags
      && ("banner" in user ? this.banner === user.banner : true)
      // && ("accent_color" in user ? this.accentColor === user.accent_color : true)
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
