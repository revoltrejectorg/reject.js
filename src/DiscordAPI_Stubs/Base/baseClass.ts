import { Client } from "../Client";
import { RejectBase } from "./RejectBase";

/**
 * reference: https://discord.js.org/#/docs/discord.js/stable/class/Base
*/
export class baseClass extends RejectBase {
  // FIXME: Needs better way to avoid circular dependency
  rejectClient: Client;

  get client() {
    return this.rejectClient;
  }

  constructor(client: Client) {
    super();
    this.rejectClient = client;
  }

  _clone() {
    return Object.assign(Object.create(this), this) as this;
  }

  _patch<T>(data: T) {
    return data;
  }

  _update<T>(data: T) {
    const clone = this._clone();
    this._patch(data);
    return clone;
  }

  async fetch() {
    return this as any;
  }

  async fetchFlags() {
    return undefined as any;
  }

  toJSON(...props: any) {
    return JSON.stringify(this) as string;
  }

  valueOf() {
    return this.rejectClient.user?.id ?? "0";
  }
}
