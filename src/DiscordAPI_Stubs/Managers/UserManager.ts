import { ChannelType, MessageCreateOptions, MessagePayload } from "discord.js";
import { DMChannel } from "../Channels";
import { Client } from "../Client";
import { GuildMember } from "../GuildMember";
import { Message } from "../Message";
import { Snowflake, UserResolvable } from "../types";
import { User } from "../User";
import { CachedManager } from "./CachedManager";

export class UserManager extends CachedManager<User> {
  constructor(client: Client, iterable = false) {
    super(client, User as any, iterable);
  }

  resolve(user: UserResolvable) {
    if (user instanceof GuildMember && user.user) return user.user;
    if (user instanceof Message) return user.author;
    return super.resolve(user);
  }

  resolveId(user: UserResolvable): Snowflake | null | undefined {
    if (user instanceof GuildMember) return user.user?.id;
    if (user instanceof Message) return user.author.id;
    return super.resolveId(user);
  }

  dmChannel(userId: Snowflake) {
    return this.client.channels.cache
      .find((c): c is DMChannel => c.type === ChannelType.DM && c.recipientId === userId) ?? null;
  }

  async createDM(user: UserResolvable, { cache = true, force = false } = {}) {
    const id = this.resolveId(user);

    if (!id) return;

    if (!force) {
      const dmChannel = this.dmChannel(id);
      if (dmChannel && !dmChannel.partial) return dmChannel;
    }

    return;
  }

  async send(user: UserResolvable, options: string | MessageCreateOptions) {
    return (await this.createDM(user))?.send(options);
  }
}
