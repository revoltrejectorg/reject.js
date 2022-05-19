import { Base as DiscordBase } from "discord.js";

/** Literally just exports identifiers for detecting Reject. */
export class baseClass implements DiscordBase {
  /** Can be used to detect if the command you're receiving is from Discord or Revolt */
  isRevolt: boolean = true;

  get client() { return undefined as any; }

  private _equals(user: any): boolean { return true; }

  equals(user: any): boolean { return this._equals(user); }

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
    return this.toJSON();
  }
}
