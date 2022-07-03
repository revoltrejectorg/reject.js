import { BanOptions } from "discord.js";
import { Client } from "../Client";
import { GuildMember } from "../GuildMember";
import { CachedManager } from "./CachedManager";

export class GuildMemberManager extends CachedManager {
  private revoltMembers: Array<GuildMember>;

  constructor(members: Array<GuildMember>, client: Client) {
    super(client.revoltClient, GuildMember, false);
    this.revoltMembers = members;
  }

  // FIXME: make this NOT use the any type
  async ban(user: any, options: BanOptions) {
    const member = this.revoltMembers.find((m) => m.user?.id === user.id);
    if (!member) throw new Error("User not in guild");
    member.ban();
  }
}
