import { EventEmitter } from "events";
import { Client as revoltClient } from "revolt.js";
import { RejectBase } from "../Base";

/**
 * reference: https://discord.js.org/#/docs/discord.js/stable/class/BaseClient
*/
export class BaseClient extends EventEmitter implements RejectBase {
  isRevolt: true = true;

  revoltClient: revoltClient;

  /**
   * FIXME: either need to reimplement discord.js rest,
   * or force bots to use revolt's rest
  */
  get api() {
    return this.revoltClient.api;
  }

  get options() { return this.revoltClient.options; }

  constructor(rClient: revoltClient) {
    super();
    this.revoltClient = rClient;
  }

  destroy() {
    this.revoltClient.logout(true);
  }

  private incrementMaxListeners() {
    const maxListeners = this.getMaxListeners();
    if (maxListeners !== 0) {
      this.setMaxListeners(maxListeners + 1);
    }
  }

  private decrementMaxListeners() {
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
