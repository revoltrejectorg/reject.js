import { Client as revoltClient } from "revolt.js";
import { missingEquiv } from "./Utils/Logger";
import { User } from "./DiscordAPI_Stubs/User";
import { baseClass } from "./DiscordAPI_Stubs/Base";
import { GuildManager } from "./DiscordAPI_Stubs/Managers/GuildManager";
import { Application } from "./DiscordAPI_Stubs/structures/interfaces";

export class ClientApplication extends Application {
  get botPublic() { return this.rejectClient.user?.bot; }

  get botRequireCodeGrant() { return false; }

  get commands() { return []; }

  /** FIXME: wtf is this for anyways?? */
  // @ts-ignore
  flags = undefined;

  get owner() {
    if (this.revoltClient.user?.bot?.owner) return new User(this.revoltClient.user);
    return null;
  }

  get cover() {
    return this.coverURL();
  }

  get partial() {
    return !this.name;
  }

  rpcOrigins?: never;
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
