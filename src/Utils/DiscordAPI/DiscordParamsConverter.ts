import { MessageEmbed, MessageEmbedOptions, MessageOptions } from "discord.js";
import { API } from "revolt.js";
import { APIEmbed } from "discord-api-types/v10";
import { fixme } from "../Logger";

export namespace Reject.Utils.DiscordAPI {
    export type revoltMessagePayload = any;

    export function checkifString(content: any) {
      if (typeof content === "string") return true;
      return false;
    }

    export function embedConvert(embed: MessageEmbed | MessageEmbedOptions | APIEmbed): API.SendableEmbed {
      fixme("embed conversion is highly experimental, and may not work as intended");
      return {
        title: embed.title,
        url: embed.url,
        description: (() => {
          let str = embed.description;

          embed.fields?.forEach((field) => {
            str += `\n\n**${field.name}**\n\n${field.value}`;
          });

          return str;
        })(),
      };
    }

    export function discordParamsToRevolt(params: MessageOptions) {
      const revoltParams: revoltMessagePayload = {
        // Revolt doesn't like blank messages
        content: params.content ?? " ",
        embeds: (() => {
          if (!params.embeds || (params.embeds && !params.embeds[0])) return undefined;
          // @ts-ignore
          return params.embeds.map((embed) => embedConvert(embed));
        })(),
      };
      return revoltParams;
    }

    export function ChannelTypeConverter(channelType: string) {
      switch (channelType) {
        case "DirectMessage": return "DM";
        case "Group": return "GROUP_DM";
        case "TextChannel": return "GUILD_TEXT";
        case "VoiceChannel": return "GUILD_VOICE";
        case "Category": return "GUILD_CATEGORY";
        case "News": return "GUILD_NEWS";
        case "Store": return "GUILD_STORE";
        case "GuildPublicThread": return "GUILD_PUBLIC_THREAD";
        case "GuildPrivateThread": return "GUILD_PRIVATE_THREAD";
        case "GuildNewsThread": return "GUILD_NEWS_THREAD";
        default: return "UNKNOWN";
      }
    }
}
