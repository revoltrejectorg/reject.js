import { MessageEmbed, MessageEmbedOptions, MessageOptions } from "discord.js";
import { API, Client as RevoltClient } from "revolt.js";
// eslint-disable-next-line import/no-extraneous-dependencies
import { APIEmbed } from "discord-api-types/v10";
import axios from "axios";
import { discordJSColorToHex, rgbToHex } from "../colorTils";
import { UploadFile } from "../UploadFile";

export type revoltMessagePayload = any;

async function createFileBuffer(url: string) {
  const res = Buffer.from(
    await (await axios.get(url, { responseType: "arraybuffer" })).data,
  );
  return res;
}
export async function embedConvert(
  embed: MessageEmbed | MessageEmbedOptions | APIEmbed,
  client?: RevoltClient,
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
    // FIXME: Highly inefficient
    media: embed.image?.url ? await UploadFile({
      name: "image.png",
      file: await createFileBuffer(embed.image.url),
    }).catch(() => undefined) : undefined,
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
export async function msgParamsConverter(params: MessageOptions | string, client?: RevoltClient) {
  if (typeof params === "string") return params;

  const revoltParams: Omit<API.DataMessageSend, "nonce"> = {
    // Revolt doesn't like blank messages
    content: params.content ?? " ",
    embeds: await (async () => {
      if (!params.embeds || !(params.embeds[0])) return;
      const convEmbeds = await Promise
        .all(params.embeds.map((embed) => embedConvert(embed)));

      return convEmbeds;
    })(),
  };
  return revoltParams;
}

export async function msgEditConvert(params: MessageOptions | string, client?: RevoltClient) {
  const convertedParams = await msgParamsConverter(params, client);

  const editParams: API.DataEditMessage = typeof convertedParams === "string"
    ? { content: convertedParams } : {
      content: convertedParams.content,
      embeds: convertedParams.embeds,
    };

  return editParams;
}
