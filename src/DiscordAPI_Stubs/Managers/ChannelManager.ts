import { Client as RevoltClient } from "revolt.js";
import { BaseChannel, Channel } from "../Channels";
import { Client } from "../Client";
import { CachedManager } from "./CachedManager";

// STUB
export class ChannelManager extends CachedManager<Channel> {
  constructor(client: Client, iterable = false) {
    super(client, BaseChannel as any, iterable);
  }
}
