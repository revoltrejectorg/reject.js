import { Events } from "discord.js";
import { User } from "../User";
import { GuildManager } from "../Managers/GuildManager";
import { ClientApplication } from "./ClientApplication";
import { BaseClient } from "./BaseClient";
import { WebSocketManager } from "./WebSocketManager";
import { ClientVoiceManager } from "./ClientVoiceManager";
import { BaseGuildEmojiManager, ChannelManager } from "../Managers";

export class Client extends BaseClient {
  get application() { return new ClientApplication(this.revoltClient); }

  // FIXME
  get channels() {
    return new ChannelManager(this.revoltClient, false);
  }

  get emojis() {
    const emojis = new BaseGuildEmojiManager(this.revoltClient, false);
    this.guilds.cache.forEach((guild) => {
      if (guild.available) {
        guild.emojis.cache.forEach((emoji) => {
          emojis.cache.set(emoji.id, emoji);
        });
      }
    });
    return emojis;
  }

  get guilds() {
    return new GuildManager(this.revoltClient);
  }

  get readyAt() { return new Date(this.readyTimestamp); }

  readyTimestamp: number = 0;

  shard = {
    id: 0, count: 1,
  };

  sweepers = [];

  get token() {
    return this.revoltClient.session;
  }

  get uptime() {
    return this.readyTimestamp && Date.now() - this.readyTimestamp;
  }

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
    this.emit(Events.Debug, `Provided token: ${token}`);

    this.emit(Events.Debug, "Preparing to connect to the gateway...");

    try {
      await this.revoltClient.loginBot(token);
      return this.token;
    } catch (e) {
      this.destroy();
      throw e;
    }
  }

  // FIXME: simulate ws and rest destruction??
  destroy() {
    super.destroy();
  }
}
