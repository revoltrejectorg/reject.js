import {
  ClientPresence,
  ImageURLOptions,
  PresenceData,
  User as DiscordUser,
  UserMention as DiscordUserMention
} from "discord.js";
import { User as revoltUser } from 'revolt.js/dist/maps/Users';
import { toDiscordStatus, toRevoltStatus } from '../Utils/DiscordAPI';
import { Client } from '../Client';
import { fixme } from '../Utils/Logger';
import { baseClass } from './Base';

export default class User extends baseClass implements DiscordUser {
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

  /** FIXME: no idea how to implement */
  // @ts-ignore stfu incorrect assumption
  partial = false;

  get presence(): ClientPresence {
    const usrCls = this;
    return {
      status: toDiscordStatus(this.revoltUser.status),
      activities: [],
      clientStatus: {
        desktop: 'online'
      },
      //@ts-ignore
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
              text: presence.activities[0]?.name
            }
          })
      }

        return this;
      }
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

  openDM = () => this.createDM();

  /** FIXME: Revolt won't let bots create DMs. insert pls fix. */
  // @ts-ignore
  async createDM(force?: boolean) {
    fixme("bot's cant create dms yet, please catch the error below!");

    throw new Error("please catch this error as bot's cant create dms yet!");
  }

  // @ts-ignore
  async deleteDM() {
    fixme("bot's cant delete dms yet, please catch the error below!");

    throw new Error();
  }

  toString(): DiscordUserMention {
    return `<@${this.id}>`;
  }
}
