import { EventEmitter } from "events";
import { CreateVoiceConnectionOptions, JoinConfig } from "@discordjs/voice";
// @ts-ignore
import RevoiceModule from "revoice.js";

const { Revoice, MediaPlayer } = RevoiceModule;

// TODO
export class VoiceConnection extends EventEmitter {
  private revoice: typeof Revoice;

  rejoinAttempts = 0;

  readonly joinConfig: JoinConfig;

  debug: any;

  constructor(joinConfig: JoinConfig, options: CreateVoiceConnectionOptions) {
    super();

    this.joinConfig = joinConfig;
    this.debug = options.debug ? (message: string) => this.emit("debug", message) : null;
  }
}

export function createVoiceConnection(joinConfig: JoinConfig, options: any) {
  return new VoiceConnection(joinConfig, options);
}
