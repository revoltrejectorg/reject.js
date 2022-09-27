import { BanOptions } from "discord.js";
import { Guild } from "../Guild";
import { GuildMember } from "../GuildMember";
import { User } from "../User";
import { CachedManager } from "./CachedManager";

export class GuildMemberManager extends CachedManager<GuildMember> {
  private guild: Guild;

  /**
   * FIXME: not accurate to discord.js, as we usually get the member by id
   * however, this is miles faster than by id
  */
  get me() {
    return this.guild.me;
  }

  constructor(guild: Guild) {
    super(guild.client, GuildMember as any, false);

    this.guild = guild;

    // FIXME: causes a copius amount of requests sometimes. may need refactoring
    this.guild.revoltServer.fetchMembers().then((revoltMembers) => {
      revoltMembers.members.forEach((revoltMember) => {
        this._add(new GuildMember(revoltMember, this.client));
      });
    });
  }

  // FIXME: make this NOT use the any type
  async ban(user: any, options: BanOptions) {
    const member = this.cache.find((m) => m.user?.id === user.id);
    if (!member) throw new Error("User not in guild");
    member.ban(options);
  }

  async kick(user: User, reason: string) {
    const member = this.cache.find((m) => m.user?.id === user.id);
    if (!member) throw new Error("User not in guild");
    member.kick(reason);
  }
}
