import { Client as RevoltClient } from "revolt.js";
import { BaseChannel, Channel } from "../Channels";
import { CachedManager } from "./CachedManager";

export class ChannelManager extends CachedManager<Channel> {
  constructor(client: RevoltClient, iterable = false) {
    super(client, BaseChannel as any, iterable);
  }
}
