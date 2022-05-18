import { Client as revoltClient } from "revolt.js";
import { Client as DiscordClient, ClientApplication as DiscordClientApp, ImageURLOptions } from "discord.js";
import { missingEquiv } from "./Utils/Logger";
import User from "./DiscordAPI_Stubs/User";
import { baseClass } from "./DiscordAPI_Stubs/Base";
import GuildManager from "./DiscordAPI_Stubs/Managers/GuildManager";

export class ClientApplication extends baseClass {
  private revoltClient: revoltClient;
  private rejectClient: Client;

  get botPublic() { return this.rejectClient.user?.bot; }
  get botRequireCodeGrant() { return false; }
  get commands() { return []; }

  get createdAt() { return this.rejectClient.user?.createdAt; }

  get createdTimestamp() { return this.rejectClient.user?.createdAt; }

  description = "FIXME";

  /** FIXME: wtf is this for anyways?? */
  // @ts-ignore
  flags = undefined;

  icon = "http://FIXME";

  get id() {
    return this.revoltClient.user?._id ?? "0";
  }

  get name() { return this.revoltClient.user?.username ?? null; }

  get owner() {
    if (this.revoltClient.user?.bot?.owner) return new User(this.revoltClient.user);
    return null;
  }

  coverURL = "http://FIXME";
  cover = "FIXME";
  partial = false;
  rpcOrigins?: never;

  constructor(rClient: revoltClient) {
    super();
    this.revoltClient = rClient;
    this.rejectClient = new Client(this.revoltClient);
  }

  async fetchAssets() {
    return {};
  }

  iconURL(options?: ImageURLOptions) {
    return this.rejectClient.user?.avatarURL(options ?? { size: 128 });
  }
}

export class Client extends baseClass {
  private revoltClient: revoltClient;

  get application() { return new ClientApplication(this.revoltClient); }

  get channels() { missingEquiv("channels"); return []; }

  get emojis() { missingEquiv("emojis"); return []; }

  get guilds() { return new GuildManager(this.revoltClient.servers); }

  get options() { return this.revoltClient.options; }

  get readyAt() { missingEquiv("readyAt"); return Date.now(); }

  get readyTimestamp() { missingEquiv("readyTimestamp"); return Date.now(); }

  get shard() { missingEquiv("shard"); return { id: 0, count: 1 }; }

  get sweepers() { missingEquiv("sweepers"); return []; }

  get token() { missingEquiv("token"); return ""; }

  get uptime() { missingEquiv("uptime"); return 0; }

  get user() {
    if (this.revoltClient.user) return new User(this.revoltClient.user);
    return null;
  }

  get users() { return this.revoltClient.users; }

  get voice() { missingEquiv("voice"); return {}; }
  
  get ws() { return this.revoltClient.websocket; }

  constructor(rClient: revoltClient) {
    super();
    this.revoltClient = rClient;
  }
}
