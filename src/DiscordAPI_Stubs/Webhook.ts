import {
  Webhook as DiscordWebhook,
  ChannelWebhookCreateOptions as DiscordChannelWebhookCreateOptions,
  MessageOptions,
} from "discord.js";
import { WebhookTypes } from "discord.js/typings/enums";
import { Channel as RevoltChannel } from "revolt.js";
import { fixme } from "../Utils";
import { baseClass, RejectBase } from "./Base";
import { BaseGuildTextChannel } from "./Channels";

/** FIXME: Revolt doesn't support webhooks, this is only a dummy. */
export class Webhook extends baseClass implements DiscordWebhook {
  name: string;

  avatar = "https://FIXME";

  channelId: string;

  guildId: string;

  id = "0";

  token = "null";

  /** FIXME: No idea how to make this not cry over types */
  type = WebhookTypes.Application as any;

  owner = null as any;

  readonly url = "http://FIXME";

  private fixmsg = "webhooks don't exist in revolt, passing dummy type";

  sourceChannel: any;

  sourceGuild: any;

  constructor(
    name: string,
    channel: BaseGuildTextChannel,
    options?: DiscordChannelWebhookCreateOptions,
  ) {
    super(channel.rejectClient);
    this.name = name ?? "REJECTFIXME";
    this.channelId = channel.id;
    this.guildId = channel.guild?.id ?? "0";
    this.sourceChannel = channel;
    this.sourceGuild = channel.guild;

    fixme(this.fixmsg);
  }

  get createdAt() { return new Date(); }

  get createdTimestamp() { return 0; }

  sendSlackMessage(body: unknown): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  /** FIXME: Literally all of these need stubs */
  async send(message: string | MessageOptions) {
    return null as any;
  }

  async delete() {}

  avatarURL() {
    return "https://FIXME";
  }

  async deleteMessage() {}

  async edit() {
    return null as any;
  }

  async editMessage() {
    return null as any;
  }

  async fetchMessage() {
    return null as any;
  }

  isChannelFollower() { return false; }

  isIncoming() { return false; }
}
