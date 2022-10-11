import { TypedEmitter } from "tiny-typed-emitter";
import { Client as revoltClient } from "revolt.js";
import { Mixin } from "ts-mixer";
import { Events } from "discord.js";
import { RejectBase } from "../Base";
import { type Message } from "../Message";
import { type BaseChannel } from "../Channels";
import { type Guild } from "../Guild";
import { type GuildEmoji } from "../structures";
import { type User } from "../User";
import { type GuildMember } from "../GuildMember";

type eventFn<T> = (p: T) => any;

type msgEvent = eventFn<Message>;

type chEvent = eventFn<BaseChannel>;

type guildEvent = eventFn<Guild>;

type emojiEvent = eventFn<GuildEmoji>;

type userEvent = eventFn<User>;

type memberEvent = eventFn<GuildMember>;

interface clientEvents {
  [Events.MessageCreate]: msgEvent;
  [Events.MessageDelete]: msgEvent;
  [Events.MessageUpdate]: msgEvent;
  [Events.MessageBulkDelete]: msgEvent;

  [Events.ChannelCreate]: chEvent;
  [Events.ChannelUpdate]: chEvent;
  [Events.ChannelDelete]: chEvent;

  [Events.GuildCreate]: guildEvent;
  [Events.GuildUpdate]: guildEvent;
  [Events.GuildUnavailable]: guildEvent;
  [Events.GuildDelete]: guildEvent;
  [Events.GuildMemberAdd]: memberEvent;
  [Events.GuildMemberAvailable]: memberEvent;
  [Events.GuildMemberRemove]: memberEvent;
  [Events.GuildMemberUpdate]: memberEvent;

  [Events.ThreadDelete]: eventFn<any>;

  [Events.ClientReady]: eventFn<any>;

  [Events.ShardDisconnect]: () => void;

  [Events.Debug]: eventFn<string>;

  [Events.GuildEmojiCreate]: emojiEvent;
  [Events.GuildEmojiDelete]: emojiEvent;
  [Events.GuildEmojiUpdate]: emojiEvent;

  [Events.UserUpdate]: userEvent;
}
/**
 * @see https://discord.js.org/#/docs/discord.js/stable/class/BaseClient
*/
export class BaseClient extends Mixin(
TypedEmitter<clientEvents>,
RejectBase,
) {
  revoltClient: revoltClient;

  /**
   * FIXME: either need to reimplement discord.js rest,
   * or force bots to use revolt's rest
  */
  get api() {
    return null;
  }

  get options() { return this.revoltClient.options as any; }

  get rest() {
    return null as any;
  }

  constructor(rClient: revoltClient) {
    super();
    this.revoltClient = rClient;
  }

  destroy() {
    this.revoltClient.logout(true);
  }

  incrementMaxListeners() {
    const maxListeners = this.getMaxListeners();
    if (maxListeners !== 0) {
      this.setMaxListeners(maxListeners + 1);
    }
  }

  decrementMaxListeners() {
    const maxListeners = this.getMaxListeners();
    if (maxListeners !== 0) {
      this.setMaxListeners(maxListeners - 1);
    }
  }

  // FIXME: hack to make sure bots dont crash
  toJSON() {
    return "";
  }
}
