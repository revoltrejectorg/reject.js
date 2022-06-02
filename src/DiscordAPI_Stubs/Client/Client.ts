import { Client as revoltClient } from "revolt.js";
import { missingEquiv } from "../../Utils/Logger";
import { User } from "../User";
import { GuildManager } from "../Managers/GuildManager";
import { ClientApplication } from "./ClientApplication";
import { BaseClient } from "./BaseClient";

export class Client extends BaseClient {
  private revoltClient: revoltClient;

  get application() { return new ClientApplication(this.revoltClient); }

  get channels() { missingEquiv("channels"); return []; }

  get emojis() { missingEquiv("emojis"); return []; }

  get guilds() { return new GuildManager(this.revoltClient); }

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
