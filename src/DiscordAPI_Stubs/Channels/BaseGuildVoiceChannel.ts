import { GuildChannel } from "./GuildChannel";

export class BaseGuildVoiceChannel extends GuildChannel {
  // FIXME
  bitrate = 96000;

  full = false;

  get joinable() {
    return this.guild?.me?.permissions?.has("CONNECT") ?? false;
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
