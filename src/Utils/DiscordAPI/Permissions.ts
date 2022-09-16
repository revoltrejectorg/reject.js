import { PermissionFlagsBits } from "discord.js";
import {
  Channel, Member, Server, Permission,
} from "revolt.js";
import { Collection } from "../../DiscordAPI_Stubs/DiscordJS_Stubs";
import { swap } from "../js";

type revoltPermissionKeys = keyof typeof Permission;

type revoltPermissions = typeof Permission[revoltPermissionKeys];

// Discord -> Revolt
export const PermissionsMap: { [key: string]: keyof typeof Permission } = {
  ManageChannels: "ManageChannel",
  ManageGuild: "ManageServer",
  ManageRoles: "ManageRole",
  KickMembers: "KickMembers",
  BanMembers: "BanMembers",
  ChangeNickname: "ChangeNickname",
  ManageNicknames: "ManageNicknames",
  ViewChannel: "ViewChannel",
  ReadMessageHistory: "ReadMessageHistory",
  SendMessages: "SendMessage",
  ManageMessages: "ManageMessages",
  /**
   * FIXME: Will be incorrect once webhooks
   * are actually implemented
  */
  ManageWebhooks: "Masquerade",
  CreateInstantInvite: "InviteOthers",
  EmbedLinks: "SendEmbeds",
  AttachFiles: "UploadFiles",
  Connect: "Connect",
  Speak: "Speak",
  MuteMembers: "MuteMembers",
  DeafenMembers: "DeafenMembers",
  MoveMembers: "MoveMembers",
  ManageEmojisAndStickers: "ManageCustomisation",
};

export const enumPermsMap: { [key: number]: revoltPermissions } = {
  [Number(PermissionFlagsBits.ManageChannels)]: Permission.ManageChannel,
  [Number(PermissionFlagsBits.ManageGuild)]: Permission.ManageServer,
  [Number(PermissionFlagsBits.ManageRoles)]: Permission.ManageRole,
  [Number(PermissionFlagsBits.KickMembers)]: Permission.KickMembers,
  [Number(PermissionFlagsBits.BanMembers)]: Permission.BanMembers,
  [Number(PermissionFlagsBits.ChangeNickname)]: Permission.ChangeNickname,
  [Number(PermissionFlagsBits.ManageNicknames)]: Permission.ManageNicknames,
  [Number(PermissionFlagsBits.ViewChannel)]: Permission.ViewChannel,
  [Number(PermissionFlagsBits.ReadMessageHistory)]: Permission.ReadMessageHistory,
  [Number(PermissionFlagsBits.SendMessages)]: Permission.SendMessage,
  [Number(PermissionFlagsBits.ManageMessages)]: Permission.ManageMessages,
  [Number(PermissionFlagsBits.ManageWebhooks)]: Permission.ManageWebhooks,
  [Number(PermissionFlagsBits.CreateInstantInvite)]: Permission.InviteOthers,
  [Number(PermissionFlagsBits.EmbedLinks)]: Permission.SendEmbeds,
  [Number(PermissionFlagsBits.AttachFiles)]: Permission.UploadFiles,
  [Number(PermissionFlagsBits.Connect)]: Permission.Connect,
  [Number(PermissionFlagsBits.Speak)]: Permission.Speak,
  [Number(PermissionFlagsBits.MuteMembers)]: Permission.MuteMembers,
  [Number(PermissionFlagsBits.DeafenMembers)]: Permission.DeafenMembers,
  [Number(PermissionFlagsBits.MoveMembers)]: Permission.MoveMembers,
  [Number(PermissionFlagsBits.ManageEmojisAndStickers)]: Permission.ManageCustomisation,
  [Number(PermissionFlagsBits.AddReactions)]: Permission.React,
};

export const RevoltPermissionsMap = swap(PermissionsMap);

export const enumRevoltPermissionsMap = swap(enumPermsMap);

export function getAllPermissions(member: Member, target: Server | Channel) {
  const permissions = new Collection<string, string>();

  const permMap = Object.entries(PermissionsMap);

  permMap.forEach(([key, value]) => {
    if (member.hasPermission(target, value)) {
      permissions.set(key, value);
    }
  });

  return permissions;
}
