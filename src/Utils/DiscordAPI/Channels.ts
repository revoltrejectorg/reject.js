import { ChannelTypes } from "discord.js/typings/enums";
import { API } from "revolt.js";
import { swap } from "../js";

// Discord -> Revolt
export const channelsMap: { [key: string]: API.Channel["channel_type"] } = {
  DM: "DirectMessage",
  GROUP_DM: "Group",
  GUILD_TEXT: "TextChannel",
  GUILD_VOICE: "VoiceChannel",
};

// Revolt -> Discord
export const discordChannelsMap = swap(channelsMap);

export function convertChannelType(channelType: API.Channel["channel_type"]
  | keyof typeof ChannelTypes, toRevolt: boolean) {
  if (toRevolt) {
    return channelsMap[channelType];
  }

  return discordChannelsMap[channelType] ?? "UNKNOWN";
}
