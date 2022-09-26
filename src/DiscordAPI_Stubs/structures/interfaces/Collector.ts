/* eslint-disable no-undef */
import {
  Collection, CollectorFilter, CollectorOptions, CollectorResetTimerOptions,
} from "discord.js";
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

  get endReason() {
    return this._endReason;
  }

  get next() {
    return new Promise((resolve, reject) => {
      if (this.ended) {
        reject(this.collected);
        return;
      }

      const cleanup = () => {
        // eslint-disable-next-line no-use-before-define
        this.removeListener("collect", onCollect);
        // eslint-disable-next-line no-use-before-define
        this.removeListener("end", onEnd);
      };

      const onCollect = (item: any) => {
        cleanup();
        resolve(item);
      };

      const onEnd = () => {
        cleanup();
        reject(this.collected);
      };

      this.on("collect", onCollect);
      this.on("end", onEnd);
    });
  }

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

  collect(...args: any): any {}

  checkEnd() {
    const reason = this.endReason;
    if (reason) this.stop(reason);
    return Boolean(reason);
  }

  resetTimer({ time, idle }: CollectorResetTimerOptions = {}) {
    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = setTimeout(() => this.stop("time"), time ?? this.options.time).unref();
    }
    if (this._idletimeout) {
      clearTimeout(this._idletimeout);
      this._idletimeout = setTimeout(() => this.stop("idle"), idle ?? this.options.idle).unref();
    }
  }

  dispose(...args: any): any {}

  async handleCollect(...args: any) {
    const collectedId = await this.collect(...args);

    if (collectedId) {
      const filterResult = await this.filter(...args, this.collected);
      if (filterResult) {
        this.collected.set(collectedId, args[0]);

        /**
         * Emitted whenever an element is collected.
         * @event Collector#collect
         * @param {...*} args The arguments emitted by the listener
         */
        this.emit("collect", ...args);

        if (this._idletimeout) {
          clearTimeout(this._idletimeout);
          this._idletimeout = setTimeout(() => this.stop("idle"), this.options.idle).unref();
        }
      } else {
        this.emit("ignore", ...args);
      }
    }
    this.checkEnd();
  }

  async handleDispose(...args: any) {
    if (!this.options.dispose) return;

    const dispose = this.dispose(...args);
    if (!dispose || !(await this.filter(...args)) || !this.collected.has(dispose)) return;
    this.collected.delete(dispose);

    this.emit("dispose", ...args);
    this.checkEnd();
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

    this._endReason = reason;
    this.ended = true;

    this.emit("end", this.collected, reason);
  }

  // FIXME
  toJSON() {}
}
