import { User } from "../User";
import { GuildManager } from "../Managers/GuildManager";
import { ClientApplication } from "./ClientApplication";
import { BaseClient } from "./BaseClient";
import { Emoji } from "../structures";
import { WebSocketManager } from "./WebSocketManager";
import { ClientVoiceManager } from "./ClientVoiceManager";

export class Client extends BaseClient {
  get application() { return new ClientApplication(this.revoltClient); }

  // FIXME
  channels = [];

  get emojis() {
    return [...this.revoltClient.emojis.values()].map((emoji) => new Emoji(this, emoji));
  }

  get guilds() { return new GuildManager(this.revoltClient); }

  get readyAt() { return new Date(this.readyTimestamp); }

  readyTimestamp: number = 0;

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
  voice = new ClientVoiceManager(this);

  ws = new WebSocketManager(this);

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
