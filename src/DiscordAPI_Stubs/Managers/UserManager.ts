import { Client } from "../Client";
import { GuildMember } from "../GuildMember";
import { Message } from "../Message";
import { User } from "../User";
import { CachedManager } from "./CachedManager";

export class UserManager extends CachedManager<User> {
  constructor(client: Client, iterable = false) {
    super(client, User as any, iterable);
  }

  resolve(user: GuildMember | Message | User | string) {
    if (user instanceof GuildMember && user.user) return user.user;
    if (user instanceof Message) return user.author;
    return super.resolve(user);
  }

  resolveId(user: GuildMember | Message | User | string) {
    if (user instanceof GuildMember) return user.user?.id;
    if (user instanceof Message) return user.author.id;
    return super.resolveId(user);
  }
}
