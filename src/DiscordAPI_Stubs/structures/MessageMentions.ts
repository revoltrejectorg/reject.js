import { Events, FormattingPatterns } from "discord.js";
import { User as RevoltUser } from "revolt.js";
import { baseClass } from "../Base";
import { BaseChannel } from "../Channels";
import { Collection } from "../DiscordJS_Stubs";
import { GuildMember } from "../GuildMember";
import { Message } from "../Message";
import { User } from "../User";

export class MessageMentions extends baseClass {
  private revoltUsers?: (RevoltUser | undefined)[];

  static EveryonePattern = /@(?<mention>everyone|here)/;

  static UsersPattern = FormattingPatterns.UserWithOptionalNickname;

  static RolesPattern = FormattingPatterns.Role;

  static ChannelsPattern = FormattingPatterns.Channel;

  static GlobalChannelsPattern = new RegExp(this.ChannelsPattern.source, "g");

  static GlobalUsersPattern = new RegExp(this.UsersPattern.source, "g");

  users = new Collection<string, User>();

  _members?: Collection<string, GuildMember>;

  _channels?: Collection<string, BaseChannel>;

  _content: string;

  get members() {
    if (this._members) return this._members;
    if (!this.guild) return null;
    this._members = new Collection();
    this.users.forEach((user) => {
      const member = this.guild?.members.resolve(user);
      if (member) this._members?.set(user.id, member);
    });

    return this._members;
  }

  private message: Message;

  get guild() {
    return this.message.guild;
  }

  get channels() {
    if (this._channels) return this._channels;
    this._channels = new Collection();
    let matches: any;

    // eslint-disable-next-line no-cond-assign
    while ((matches = MessageMentions.GlobalChannelsPattern.exec(this._content)) !== null) {
      const channel = this.client.channels.cache.get(matches.groups.id);
      if (channel) this._channels.set(channel.id, channel);
    }

    return this._channels;
  }

  constructor(message: Message) {
    super(message.client);

    this.message = message;

    this._content = message.content;

    this.revoltUsers = this.message.revoltMsg.mentions;
    this.revoltUsers?.forEach((user) => {
      if (!user) return;
      this.users.set(user._id, new User(user, this.rejectClient));
    });
  }
}
