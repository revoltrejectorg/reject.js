import { ChannelType } from "discord.js";
import { GuildChannel } from "./GuildChannel";

export class BaseGuildVoiceChannel extends GuildChannel {
  declare type: ChannelType.GuildVoice;

  // FIXME
  bitrate = 48000;

  full = false;

  get joinable() {
    return this.guild?.me?.permissions?.has("Connect") ?? false;
  }

  // FIXME
  userLimit = Infinity;

  // FIXME - not implemented but could *maybe* be retrieved by getting the server ip location
  rtcRegion = "sydney";

  // FIXME
  async setRTCRegion(rtcRegion: string | undefined, reason: string) {
    return this;
  }
}
