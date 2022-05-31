import { Base as DiscordBase } from "discord.js";
import { fixme } from "../../Utils";

/** Literally just exports identifiers for detecting Reject. */
export class baseClass implements DiscordBase {
  /** Can be used to detect if the command you're receiving is from Discord or Revolt */
  isRevolt: boolean = true;

  get client() {
    fixme("unimplimented client getter");
    return null as any;
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
