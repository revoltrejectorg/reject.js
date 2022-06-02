import { Base as DiscordBase } from "discord.js";
import { Client as RevoltClient } from "revolt.js";
import { RejectBase } from "./RejectBase";

/**
 * reference: https://discord.js.org/#/docs/discord.js/stable/class/Base
*/
export class baseClass extends RejectBase implements DiscordBase {
  revoltClient: RevoltClient;

  // @ts-ignore
  get client() {
    return null as any;
  }

  constructor(client: RevoltClient) {
    super();
    this.revoltClient = client;
  }

  _clone() {
    return Object.assign(Object.create(this), this);
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
    return "0";
  }
}
