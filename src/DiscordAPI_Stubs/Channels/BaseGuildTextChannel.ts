import {
  ChannelWebhookCreateOptions as DiscordChannelWebhookCreateOptions,
} from "discord.js";
import { Mixin } from "ts-mixer";
import { Webhook } from "../Webhook";
import { getAllPermissions } from "../../Utils/DiscordAPI";
import { GuildMember } from "../GuildMember";
import { GuildChannel } from "./GuildChannel";
import { TextBasedChannel } from "./TextBasedChannel";

export class BaseGuildTextChannel extends Mixin(GuildChannel, TextBasedChannel) {
  get nsfw() {
    return this.revoltChannel.nsfw;
  }

  get description() { return this.revoltChannel.description; }

  async createWebhook(options: DiscordChannelWebhookCreateOptions) {
    return new Webhook(this, options);
  }

  async bulkDelete(amount: number) {
    const messages = await this.revoltChannel.fetchMessages({
      limit: amount,
    });
    const ids = messages.map((m) => m._id);

    await this.revoltChannel.deleteMessages(ids);

    return messages;
  }

  permissionsFor(member: GuildMember) {
    return getAllPermissions(member.revoltMember, this.revoltChannel);
  }
}
