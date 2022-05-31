import {
  ClientPresence,
  ImageURLOptions,
  PresenceData,
  User as DiscordUser,
  UserMention as DiscordUserMention,
} from "discord.js";
import { User as revoltUser } from "revolt.js/dist/maps/Users";
import { toDiscordStatus, toRevoltStatus } from "../Utils/DiscordAPI";
import { Client } from "../Client";
import { fixme } from "../Utils";
import { baseClass } from "./Base";
import { DMChannel } from "./Channels";

/**
 * @reference https://discord.js.org/#/docs/discord.js/stable/class/User
 */
export class User extends baseClass implements DiscordUser {
  private revoltUser: revoltUser;

  get accentColor() { return undefined; }

  /** FIXME: bad impl */
  // @ts-ignore
  get avatar() { return this.revoltUser.avatar; }

  get banner() { return undefined; }

  bannerURL() {
    return "http://FIXME";
  }

  get bot() {
    if (this.revoltUser.bot) return true;
    return false;
  }

  /** FIXME: client is improperly implemented!!! */
  // @ts-ignore
  get client() { return new Client(this.revoltUser.client); }

  get createdAt() { return new Date(this.revoltUser.createdAt * 1000); }

  get createdTimestamp() { return this.revoltUser.createdAt; }

  get defaultAvatarURL() { return this.revoltUser.defaultAvatarURL; }

  get discriminator() {
    fixme("discriminator stub");
    return "#0000";
  }

  /** FIXME: Unimplemented features */
  dmChannel = null;

  flags = null;

  hexAccentColor?: never;

  get id() { return this.revoltUser._id; }

  // @ts-ignore - correct impl, wrong type
  get partial() {
    return typeof this.username !== "string";
  }

  get presence(): ClientPresence {
    const usrCls = this;
    return {
      status: toDiscordStatus(this.revoltUser.status),
      activities: [],
      clientStatus: {
        desktop: "online",
      },
      // @ts-ignore
      _parse(data: PresenceData) {
        fixme("what is this for?");
        return data;
      },

      set(presence: PresenceData) {
        fixme("partial status impl");

        if (!usrCls.revoltUser.status) return this;

        usrCls.revoltUser.status.presence = toRevoltStatus(presence.status);
        if (presence.activities) {
          usrCls.revoltUser.client.users.edit({
            status: {
              text: presence.activities[0]?.name,
            },
          });
        }

        return this;
      },
    };
  }

  system = false;

  /** FIXME: Improper tag impl. */
  get tag() { return this.discriminator; }

  get username() { return this.revoltUser.username; }

  constructor(rUser: revoltUser) {
    super();
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

  // @ts-ignore
  send = () => this.createDM();

  // @ts-ignore
  async createDM(force = false) {
    const dm = await this.revoltUser.openDM();
    return new DMChannel(dm);
  }

  // @ts-ignore
  async deleteDM() {
    const dm = await this.revoltUser.openDM();
    fixme("delete dm stub");

    return new DMChannel(dm);
  }

  toString(): DiscordUserMention {
    return `<@${this.id}>`;
  }
}
