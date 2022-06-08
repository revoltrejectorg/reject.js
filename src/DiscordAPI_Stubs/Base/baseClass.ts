import { Base as DiscordBase, Client as DiscordClient } from "discord.js";
import { Client } from "../Client";
import { RejectBase } from "./RejectBase";

/**
 * reference: https://discord.js.org/#/docs/discord.js/stable/class/Base
*/
export class baseClass extends RejectBase implements DiscordBase {
  // FIXME: Needs better way to avoid circular dependency
  rejectClient: Client;

  get client() {
    return this.rejectClient as unknown as DiscordClient;
  }

  constructor(client: Client) {
    super();
    this.rejectClient = client;
  }

  _clone() {
    return Object.assign(Object.create(this), this);
  }

  _patch(data: any) {
    return data;
  }

  async fetch() {
    return this as any;
  }

  async fetchFlags() {
    return undefined as any;
  }

  toJSON() {
    return JSON.stringify(this) as string;
  }

  valueOf() {
    return this.rejectClient.user?.id ?? "0";
  }
}
