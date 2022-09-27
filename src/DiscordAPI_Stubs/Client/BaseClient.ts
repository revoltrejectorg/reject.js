import { TypedEmitter } from "tiny-typed-emitter";
import { Client as revoltClient } from "revolt.js";
import { Mixin } from "ts-mixer";
import { Events } from "discord.js";
import { RejectBase } from "../Base";
import { Message } from "../Message";
import { BaseChannel } from "../Channels";
import { Guild } from "../Guild";

type eventFn<T> = (p: T) => any;

type msgEvent = eventFn<Message>;

type chEvent = eventFn<BaseChannel>;

type guildEvent = eventFn<Guild>;

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
  [Events.GuildDelete]: guildEvent;
  [Events.ThreadDelete]: eventFn<any>
  [Events.ClientReady]: eventFn<any>;
  [Events.ShardDisconnect]: () => void;
  [Events.Debug]: eventFn<string>;
}
/**
 * @see https://discord.js.org/#/docs/discord.js/stable/class/BaseClient
*/
export class BaseClient extends Mixin(TypedEmitter<clientEvents>, RejectBase) {
  revoltClient: revoltClient;

  /**
   * FIXME: either need to reimplement discord.js rest,
   * or force bots to use revolt's rest
  */
  get api() {
    return null;
  }

  get options() { return this.revoltClient.options; }

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
