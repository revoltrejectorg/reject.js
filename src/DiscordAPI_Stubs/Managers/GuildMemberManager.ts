import { BanOptions } from "discord.js";
import { Guild } from "../Guild";
import { GuildMember } from "../GuildMember";
import { GuildMemberResolvable, Snowflake } from "../types";
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

    this.revoltClient.members.forEach((member) => {
      if (member.server?._id !== this.guild.id) return;

      this._add(new GuildMember(member, this.client));
    });
  }

  _add(data: GuildMember, cache = true) {
    return super._add(data, cache, { id: data.user?.id, extras: [this.guild] });
  }

  resolve(member: GuildMemberResolvable) {
    const memberResolvable = super.resolve(member);
    if (memberResolvable) return memberResolvable;

    const userResolvable = this.client.users.resolveId(member);
    if (userResolvable) return super.resolve(userResolvable);

    return null;
  }

  resolveId(member: GuildMemberResolvable): Snowflake | null {
    const memberResolvable = super.resolveId(member);
    if (memberResolvable) return memberResolvable;

    const userResolvable = this.client.users.resolveId(member);
    if (!userResolvable) return null;

    return this.cache.has(userResolvable) ? userResolvable : null;
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
