import { Events } from "discord.js";
// @ts-ignore
import { Revoice, MediaPlayer } from "revoice.js";
import { baseClass } from "../Base";
import { Client } from "./Client";

export class ClientVoiceManager extends baseClass {
  private revoice: any;

  private connection: any;

  adapters = new Map();

  constructor(client: Client) {
    super(client);

    this.revoice = new Revoice(client.token);

    this.client.on(Events.ShardDisconnect, () => {});
  }

  // FIXME
  onVoiceServer(payload: any) {}

  onVoiceStateUpdate(payload: any) {}
}
