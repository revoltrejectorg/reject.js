import { MessageEmbed, MessageEmbedOptions, MessageOptions } from "discord.js";
import { API, Client as RevoltClient } from "revolt.js";
// eslint-disable-next-line import/no-extraneous-dependencies
import { APIEmbed } from "discord-api-types/v10";
import axios from "axios";
import { discordJSColorToHex, rgbToHex } from "../colorTils";
import { UploadFile } from "../UploadFile";
import { trimIfLong } from "./charLimit";

export type revoltMessagePayload = any;

async function createFileBuffer(url: string) {
  const res = Buffer.from(
    await (await axios.get(url, { responseType: "arraybuffer" })).data,
  );
  return res;
}
export async function embedConvert(
  embed: MessageEmbed | MessageEmbedOptions | APIEmbed,
  client: RevoltClient,
): Promise<API.SendableEmbed> {
  return {
    title: embed.title,
    url: embed.url,
    description: (() => {
      let str = embed.description ?? "";

      embed.fields?.forEach((field) => {
        str += `\n\n**${field.name}**\n\n${field.value}`;
      });

      return str;
    })(),
    // FIXME: may need to use january to have revolt accept media
    media: embed.image?.url ? await UploadFile({
      name: "image.png",
      file: await createFileBuffer(embed.image.url),
    }) : undefined,
    icon_url: embed.thumbnail?.url,
    // convert color from rgb number to hex
    // eslint-disable-next-line no-nested-ternary
    colour: embed.color && typeof embed.color === "number"
      ? rgbToHex(embed.color)
      : typeof embed.color === "string" ? discordJSColorToHex(embed.color) : null,
  };
}
/**
 * @param params - the params to convert
 * @param client - the client to use for converting, needed for media
 * @returns the original string if it's a string, otherwise it's converted
 * to revolt params
 * */
export async function msgParamsConverter(params: MessageOptions | string, client: RevoltClient) {
  if (typeof params === "string") return trimIfLong(params);

  const revoltParams = {
    // Revolt doesn't like blank messages
    content: trimIfLong(params.content ?? " "),
    embeds: await (async () => {
      if (!params.embeds || !(params.embeds[0])) return;
      const convEmbeds = await Promise
        .all(params.embeds.map((embed) => embedConvert(embed, client)));

      return convEmbeds;
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
