import {
  Channel, Member, Server, Permission,
} from "revolt.js";
import { Collection } from "../../DiscordAPI_Stubs/DiscordJS_Stubs";
import { swap } from "../js";

// Discord -> Revolt
export const PermissionsMap: { [key: string]: keyof typeof Permission } = {
  MANAGE_CHANNELS: "ManageChannel",
  MANAGE_GUILD: "ManageServer",
  MANAGE_ROLES: "ManageRole",
  KICK_MEMBERS: "KickMembers",
  BAN_MEMBERS: "BanMembers",
  CHANGE_NICKNAME: "ChangeNickname",
  MANAGE_NICKNAMES: "ManageNicknames",
  VIEW_CHANNEL: "ViewChannel",
  READ_MESSAGE_HISTORY: "ReadMessageHistory",
  SEND_MESSAGES: "SendMessage",
  MANAGE_MESSAGES: "ManageMessages",
  /**
   * FIXME: Will be incorrect once webhooks
   * are actually implemented
  */
  MANAGE_WEBHOOKS: "Masquerade",
  CREATE_INSTANT_INVITE: "InviteOthers",
  EMBED_LINKS: "SendEmbeds",
  ATTACH_FILES: "UploadFiles",
  CONNECT: "Connect",
  SPEAK: "Speak",
  MUTE_MEMBERS: "MuteMembers",
  DEAFEN_MEMBERS: "DeafenMembers",
  MOVE_MEMBERS: "MoveMembers",
  MANAGE_EMOJIS_AND_STICKERS: "ManageCustomisation",
};

export const RevoltPermissionsMap = swap(PermissionsMap);

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
