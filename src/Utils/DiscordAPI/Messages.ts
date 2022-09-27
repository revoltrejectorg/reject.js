import { ChannelType, Events } from "discord.js";
import { Channel } from "../../DiscordAPI_Stubs";
import { replaceAll } from "../js";

export function cleanContent(str: string, channel: Channel) {
  return replaceAll(str, /<(@[!&]?|#)(\d{17,19})>/g, (match: any, type: any, id: any) => {
    switch (type) {
      case "@":
      case "@!": {
        if (channel.type === ChannelType.GuildText) {
          const member = channel.guild?.members.cache.get(id);
          if (member) {
            return `@${member.displayName}`;
          }
        }

        return match;

        // FIXME: Need UserManager
        // const user = channel.client.users.cache.get(id);
        // return user ? `@${user.username}` : match;
      }
      case "@&": {
        if (channel.type !== ChannelType.GuildText) return match;

        const role = channel.guild?.roles?.cache?.get(id);

        return role ? `@${role.name}` : match;
      }
      case "#": {
        const mentionedChannel = channel.client.channels.cache.get(id);
        if (mentionedChannel?.type !== ChannelType.GuildText) return;

        return mentionedChannel ? `#${mentionedChannel.name}` : match;
      }
      default: {
        return match;
      }
    }
  });
}
