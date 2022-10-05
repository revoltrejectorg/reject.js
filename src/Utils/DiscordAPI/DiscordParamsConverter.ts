import {
  AttachmentPayload, JSONEncodable, MessageEditOptions,
  APIEmbed,
  MessageCreateOptions,
  BufferResolvable,
  APIAttachment,
  Attachment,
  AttachmentBuilder,
  BaseMessageOptions,
} from "discord.js";
import { API, Client as RevoltClient } from "revolt.js";
import axios from "axios";
import internal from "stream";
import {
  discordJSColorToHex, hexToRgbCode, rgbToHex,
} from "../colorTils";
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

      if (discordEmbed.footer) {
        str += `\n\n${discordEmbed.footer.text}`;
      }

      return str.slice(0, 2048);
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

export function revoltEmbedToDiscord(embed: API.Embed): APIEmbed | undefined {
  if (embed.type !== "Text") return;

  return {
    title: embed.title ?? undefined,
    description: embed.description ?? undefined,
    url: embed.url ?? undefined,
    thumbnail: embed.icon_url ? {
      url: embed.icon_url,
    } : undefined,
    color: embed.colour ? hexToRgbCode(embed.colour) : undefined,
  };
}

// FIXME: Very borked
export async function convertFiles(files: BaseMessageOptions["files"]) {
  return Promise.all(files!.map(async (file) => {
    if (Buffer.isBuffer(file)) {
      const img = await UploadFile({
        name: "file",
        file,
      });

      return img;
    }

    if (isJSONEncodable(file)) {
      const data = (file as JSONEncodable<AttachmentPayload>).toJSON();

      if (!Buffer.isBuffer(data.attachment)) return;

      const img = await UploadFile({
        name: data.name ?? "file",
        file: data.attachment,
      });

      return img;
    }

    return;
  }));
}

/**
 * @param params - the params to convert
 * @param client - the client to use for converting, needed for media
 * @returns the original string if it's a string, otherwise it's converted
 * to revolt params
 * */
export async function msgParamsConverter(
  params: MessageCreateOptions | MessageEditOptions | string,
  client?: RevoltClient,
) {
  if (typeof params === "string") return params;

  const revoltParams: Omit<API.DataMessageSend, "nonce"> = {
    // Revolt doesn't like blank messages.
    content: params.content ?? " ",
    embeds: params.embeds ? await Promise
      .all(params.embeds.map((embed) => embedConvert(embed))) : undefined,
    attachments: params.files ? (await convertFiles(params.files))
      .filter((f): f is string => f !== undefined) : undefined,
    // @ts-ignore
    nonce: (params as any).options?.nonce ? (params as any).options.nonce : undefined,
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
