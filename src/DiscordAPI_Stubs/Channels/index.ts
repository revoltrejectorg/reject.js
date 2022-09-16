import { BaseGuildTextChannel } from "./BaseGuildTextChannel";
import { DMChannel } from "./DMChannel";
import { VoiceChannel } from "./VoiceChannel";

export * from "./BaseChannel";
export * from "./GuildChannel";
export * from "./BaseGuildTextChannel";
export * from "./DMChannel";
export * from "./VoiceChannel";
export * from "./BaseGuildVoiceChannel";
export * from "./TextBasedChannel";

export type Channel =
  | DMChannel
  | BaseGuildTextChannel
  | VoiceChannel;

export type TextBasedChannels = Exclude<Channel, VoiceChannel>
