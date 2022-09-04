import { ChannelType } from "discord.js";
import { API } from "revolt.js";
import { swap } from "../js";

// Discord -> Revolt
export const channelsMap: { [key: string]: API.Channel["channel_type"] } = {
  DM: "DirectMessage",
  GROUP_DM: "Group",
  GUILD_TEXT: "TextChannel",
  GUILD_VOICE: "VoiceChannel",
};

export const channelEnumMap: { [key: string]: API.Channel["channel_type"] } = {
  [ChannelType.DM]: "DirectMessage",
  [ChannelType.GroupDM]: "Group",
  [ChannelType.GuildText]: "TextChannel",
  [ChannelType.GuildVoice]: "VoiceChannel",
};

// Revolt -> Discord
export const discordChannelsMap = swap(channelsMap);

export const discordEnumChannelMap = swap(channelsMap);

export function convertChannelType(channelType: API.Channel["channel_type"] |ChannelType, toRevolt: boolean) {
  if (toRevolt) {
    return channelEnumMap[channelType];
  }

  return discordEnumChannelMap[channelType] ?? "UNKNOWN";
}
