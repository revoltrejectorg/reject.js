import {
  Webhook as DiscordWebhook,
  ChannelWebhookCreateOptions as DiscordChannelWebhookCreateOptions,
} from "discord.js";
import { WebhookTypes } from "discord.js/typings/enums";
import MessageOptions from "revolt.js/dist/maps/Messages";
import { fixme } from "../Utils";
import { baseClass, RejectBase } from "./Base";
import { BaseGuildTextChannel } from "./Channels";

/** FIXME: Revolt doesn't support webhooks, this is only a dummy. */
export class Webhook extends RejectBase implements DiscordWebhook {
  name: string;

  avatar = "http://FIXME";

  channelId: string;

  guildId: string;

  id = "0";

  token = "null";

  /** FIXME: No idea how to make this not cry over types */
  // @ts-ignore
  type = WebhookTypes.Application;

  readonly url = "http://FIXME";

  private fixmsg = "webhooks don't exist in revolt, passing dummy type";

  constructor(
    name: string,
    channel: BaseGuildTextChannel,
    options?: DiscordChannelWebhookCreateOptions,
  ) {
    super();
    this.name = name ?? "REJECTFIXME";
    this.channelId = channel.id;
    this.guildId = channel.guild?.id ?? "0";

    fixme(this.fixmsg);
  }

  /** FIXME: Literally all of these need stubs */
  // @ts-ignore
  async send(message: string | MessageOptions) {}

  async delete() {}

  avatarURL() {
    return "http://FIXME";
  }

  async deleteMessage() {}

  // @ts-ignore
  async edit() {}

  // @ts-ignore
  async editMessage() {}

  // @ts-ignore
  async fetchMessage() {}

  isChannelFollower() { return false; }

  isIncoming() { return false; }
}
