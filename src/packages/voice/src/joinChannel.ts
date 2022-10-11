import { JoinConfig } from "@discordjs/voice";
import { createVoiceConnection } from "./VoiceConnection";

export function joinVoiceChannel(options: any) {
  const joinConfig: JoinConfig = {
    selfDeaf: true,
    selfMute: false,
    group: "default",
    ...options,
  };

  return createVoiceConnection(joinConfig, options);
}
