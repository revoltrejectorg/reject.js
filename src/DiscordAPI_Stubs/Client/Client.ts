import { User } from "../User";
import { GuildManager } from "../Managers/GuildManager";
import { ClientApplication } from "./ClientApplication";
import { BaseClient } from "./BaseClient";

export class Client extends BaseClient {
  get application() { return new ClientApplication(this.revoltClient); }

  // FIXME
  channels = [];

  emojis = [];

  get guilds() { return new GuildManager(this.revoltClient); }

  get readyAt() { return Date.now(); }

  get readyTimestamp() { return Date.now(); }

  shard = { id: 0, count: 1 };

  sweepers = [];

  get token() { return this.revoltClient.session; }

  // FIXME
  uptime = 0;

  get user() {
    if (this.revoltClient.user) return new User(this.revoltClient.user);
    return null;
  }

  get users() { return this.revoltClient.users; }

  // TODO
  voice = {};

  get ws() { return this.revoltClient.websocket; }

  // Question for Discord.js devs: Why does this exist?
  private _eval(script: string) {
    // eslint-disable-next-line no-eval
    return eval(script);
  }

  // FIXME
  private _finalize() {}

  // FIXME
  private _validOptions() {}

  // FIXME: semi-stub
  async fetchGuildPreview(guild: string) {
    const id = this.guilds.resolveId(guild);
    if (!id) throw new TypeError("INVALID_TYPE guild GuildResolvable");
    // const data = await this.revoltClient.servers.$get(id).banner;
  }

  // FIXME
  async fetchGuildTemplate() {}

  async login(token: string) {
    this.revoltClient.loginBot(token);
  }
}
