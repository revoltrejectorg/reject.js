import { PresenceStatus } from "discord.js";
import { API } from "revolt.js";
import { Nullable } from "revolt.js/dist/util/null";

export function toDiscordStatus(revoltStatus: Nullable<API.UserStatus>): PresenceStatus {
    switch (revoltStatus) {
      case 'Online':
        return 'online';
      case 'Idle':
        return 'idle';
      case 'Busy':
        return 'dnd';
      case 'Offline':
        return 'offline';
      default:
        return 'offline';
    }
}

export function toRevoltStatus(status?: string) {
  switch(status) {
    case 'online':
      return 'Online';
    case 'idle':
      return 'Idle';
    case 'dnd':
      return 'Busy';
    case 'offline':
      /** @V3L0C1T13S i think this is correct, might need some work though */
      return 'Invisible';
    default:
      return 'Invisible';
  }
}