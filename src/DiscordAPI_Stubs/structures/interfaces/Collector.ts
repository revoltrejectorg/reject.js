/* eslint-disable no-undef */
import { Collection, CollectorFilter, CollectorOptions } from "discord.js";
import EventEmitter from "events";
import { Client } from "../../Client";

export class Collector extends EventEmitter {
  client: Client;

  filter: CollectorFilter<any>;

  options: CollectorOptions<any>;

  collected = new Collection();

  ended = false;

  _timeout: NodeJS.Timeout | null = null;

  _idletimeout: NodeJS.Timeout | null = null;

  _endReason: string | null = null;

  constructor(client: Client, options: CollectorOptions<any>) {
    super();

    this.client = client;

    this.filter = options.filter ?? (() => true);

    this.options = options;

    if (typeof this.filter !== "function") {
      throw new TypeError("expected type function in option.filter");
    }

    if (options.time) this._timeout = setTimeout(() => this.stop("time"), options.time).unref();
    if (options.idle) this._idletimeout = setTimeout(() => this.stop("idle"), options.idle).unref();
  }

  stop(reason = "user") {
    if (this.ended) return;

    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
    if (this._idletimeout) {
      clearTimeout(this._idletimeout);
      this._idletimeout = null;
    }
  }
}
