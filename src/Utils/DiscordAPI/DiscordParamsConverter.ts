import { Embed, JSONEncodable, MessageOptions } from "discord.js";
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

function isJSONEncodable<T>(maybeEncodable: T) {
  return maybeEncodable !== null && typeof maybeEncodable === "object" && "toJSON" in maybeEncodable;
}

export async function embedConvert(
  embed: APIEmbed | JSONEncodable<APIEmbed>,
  client?: RevoltClient,
): Promise<API.SendableEmbed> {
  const discordEmbed = isJSONEncodable(embed)
    ? (embed as JSONEncodable<APIEmbed>).toJSON()
    : embed as APIEmbed;

  return {
    title: discordEmbed.title,
    url: discordEmbed.url,
    description: (() => {
      let str = discordEmbed.description ?? "";

      discordEmbed.fields?.forEach((field) => {
        str += `\n\n**${field.name}**\n\n${field.value}`;
      });

      return str;
    })(),
    // FIXME: Highly inefficient
    media: discordEmbed.image?.url ? await UploadFile({
      name: "image.png",
      file: await createFileBuffer(discordEmbed.image.url),
    }).catch(() => undefined) : undefined,
    icon_url: discordEmbed.thumbnail?.url,
    // convert color from rgb number to hex
    // eslint-disable-next-line no-nested-ternary
    colour: discordEmbed.color && typeof discordEmbed.color === "number"
      ? rgbToHex(discordEmbed.color)
      : typeof discordEmbed.color === "string" ? discordJSColorToHex(discordEmbed.color) : null,
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
