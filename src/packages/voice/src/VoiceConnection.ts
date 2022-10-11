import { EventEmitter } from "events";
import { CreateVoiceConnectionOptions, JoinConfig } from "@discordjs/voice";

// TODO
export class VoiceConnection extends EventEmitter {
  private revoice: any;

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

}
