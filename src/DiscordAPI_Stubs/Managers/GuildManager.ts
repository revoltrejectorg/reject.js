import Servers from "revolt.js/dist/maps/Servers";
import { fixme } from "../../Utils/Logger";
import { Collection } from "../DiscordJS_Stubs";
import { Guild } from "../Guild";

export default class GuildManager<K, V> extends Collection<K, V> {
  private revoltServers: Servers;

  constructor(revoltServers: Servers) {
    super();
    this.revoltServers = revoltServers;
  }

  get cache() {
    return {
      size: this.revoltServers.size,
    }
  }

  async create() {
    fixme("stub");
  }

  async resolve() {
    fixme("stub");
    return;
  }

  async resolveId(guild: Guild) {
    return guild.id;
  }
}