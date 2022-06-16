import { PresenceStatus } from "discord.js";
import { API, Nullable } from "revolt.js";
import { swap } from "../js";

// Discord -> Revolt
export const statusMap: { [key: string]: API.UserStatus["presence"] } = {
  online: "Online",
  idle: "Idle",
  dnd: "Busy",
  offline: "Invisible",
};

// Revolt -> Discord
export const discordStatusMap: { [key: string ]: PresenceStatus} = swap(statusMap);

export function statusConvert(status: API.UserStatus["presence"] | PresenceStatus, toRevolt: boolean) {
  if (toRevolt) {
    return (statusMap[status ?? "offline"] ?? "Invisible") as API.UserStatus["presence"];
  }

  return (discordStatusMap[status ?? "Invisible"] ?? "offline") as PresenceStatus;
}
