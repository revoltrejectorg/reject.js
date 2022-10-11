import {
  ChannelWebhookCreateOptions as DiscordChannelWebhookCreateOptions,
  WebhookType,
  MessageCreateOptions,
  WebhookCreateMessageOptions,
  WebhookEditData,
  BufferResolvable,
} from "discord.js";
import { RawMessagePayloadData } from "discord.js/typings/rawDataTypes";
import { AutumnURL } from "../constants";
import { UploadFile } from "../Utils";
import { msgParamsConverter } from "../Utils/DiscordAPI";
import { baseClass } from "./Base";
import { BaseGuildTextChannel } from "./Channels";
import { Guild } from "./Guild";
import { Message } from "./Message";
import { Snowflake } from "./types";
import { User } from "./User";

/**
 * FIXME: Revolt doesn't support webhooks, this is only a dummy.
 * reference: https://discord.js.org/#/docs/discord.js/stable/class/Webhook
 * */
export class Webhook extends baseClass {
  name: string;

  avatar = "https://FIXME";

  channelId: string;

  guildId: string;

  id = "0";

  token = "null";

  type = WebhookType.Application;

  get owner() {
    const ownerId = this.rejectClient.revoltClient.user?.bot?.owner;
    if (!ownerId) return null;

    const owner = this.rejectClient.revoltClient.users.$get(ownerId);
    return new User(owner, this.rejectClient);
  }

  readonly url = "https://FIXME";

  sourceChannel: BaseGuildTextChannel;

  sourceGuild?: Guild;

  constructor(
    channel: BaseGuildTextChannel,
    options: DiscordChannelWebhookCreateOptions,
  ) {
    super(channel.rejectClient);
    this.name = options.name;

    this.channelId = channel.id;
    this.guildId = channel.guild?.id ?? "0";

    this.sourceChannel = channel;
    this.sourceGuild = channel.guild;

    if (options.avatar) this.__setAvatar(options.avatar);
  }

  createdTimestamp = Date.now();

  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  async sendSlackMessage(body: unknown) {
    return false;
  }

  // FIXME: Needs masquerade permissions to work properly
  async send(message: string | MessageCreateOptions | WebhookCreateMessageOptions) {
    const params = await msgParamsConverter(message, this.rejectClient.revoltClient);

    const masq = {
      name: this.name,
      avatar: this.avatar,
    };

    // add masquerade to params
    const masqueradedParams = typeof params === "string" ? {
      content: params,
      masquerade: masq,
    } : {
      ...params,
      masquerade: masq,
    };

    const msg = await this.sourceChannel.revoltChannel.sendMessage(masqueradedParams);

    return new Message(msg, this.rejectClient);
  }

  async delete() {}

  avatarURL() {
    return this.avatar;
  }

  async deleteMessage() {}

  async edit({
    name = this.name, avatar, channel, reason,
  }: WebhookEditData) {
    if (avatar) this.__setAvatar(avatar);

    this.name = name;

    return this;
  }

  async editMessage() {
    return null as any;
  }

  async fetchMessage(message: Snowflake) {
    return null as any;
  }

  isChannelFollower() {
    return false;
  }

  isIncoming() {
    return false;
  }

  private async __setAvatar(avatar: BufferResolvable) {
    if (typeof avatar !== "string") {
      const imgId = await UploadFile({
        name: "avatar",
        file: avatar,
      });
      const imgUrl = `${AutumnURL}/attachments/${imgId}`;
      this.avatar = imgUrl;
    } else this.avatar = avatar;
  }
}
