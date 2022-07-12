import { User as RevoltUser } from "revolt.js";
import { baseClass } from "../Base";
import { Collection } from "../DiscordJS_Stubs";
import { Message } from "../Message";
import { User } from "../User";

export class MessageMentions extends baseClass {
  private revoltUsers?: (RevoltUser | undefined)[];

  static EveryonePattern = /@(everyone|here)/g;

  static UsersPattern = /<@!?(\d{17,19})>/g;

  static RolesPattern = /<@&(\d{17,19})>/g;

  static ChannelsPattern = /<#(\d{17,19})>/g;

  users = new Collection<string, User>();

  private message: Message;

  get guild() {
    return this.message.guild;
  }

  private get _content() {
    return this.message.content;
  }

  get channels() {
    const channels = new Collection();

    channels.set(this.message.channel.id, this.message.channel);

    return channels;
  }

  constructor(message: Message) {
    super(message.client);

    this.message = message;

    this.revoltUsers = this.message.revoltMsg.mentions;
    this.revoltUsers?.forEach((user) => {
      if (!user) return;
      this.users.set(user._id, new User(user));
    });
  }
}
