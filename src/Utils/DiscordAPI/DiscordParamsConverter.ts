import {
  AttachmentPayload, JSONEncodable, MessageEditOptions, MessageOptions, APIEmbed,
} from "discord.js";
import { API, Client as RevoltClient } from "revolt.js";
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

export async function convertAttachment(attachment: JSONEncodable<AttachmentPayload>) {
  const attachmentJSON = attachment.toJSON();

  // FIXME: strings are currently unhandled
  if (!Buffer.isBuffer(attachmentJSON.attachment)) return;

  const res = await UploadFile({
    name: attachmentJSON.name ?? "attachment",
    file: attachmentJSON.attachment,
  });

  return res;
}

/**
 * @param params - the params to convert
 * @param client - the client to use for converting, needed for media
 * @returns the original string if it's a string, otherwise it's converted
 * to revolt params
 * */
export async function msgParamsConverter(
  params: MessageOptions | MessageEditOptions | string,
  client?: RevoltClient,
) {
  if (typeof params === "string") return params;

  const revoltParams: Omit<API.DataMessageSend, "nonce"> = {
    // Revolt doesn't like blank messages.
    content: params.content ?? " ",
    embeds: params.embeds ? await Promise
      .all(params.embeds.map((embed) => embedConvert(embed))) : undefined,
    attachments: params.attachments ? (await Promise
      .all(params.attachments.map((attachment) => convertAttachment(attachment))))
      .filter((attachment): attachment is string => attachment !== undefined) : undefined,
  };

  return revoltParams;
}

export async function msgEditConvert(params: MessageEditOptions | string, client?: RevoltClient) {
  const convertedParams = await msgParamsConverter(params, client);

  const editParams: API.DataEditMessage = typeof convertedParams === "string"
    ? { content: convertedParams } : {
      content: convertedParams.content,
      embeds: convertedParams.embeds,
    };

  return editParams;
}
