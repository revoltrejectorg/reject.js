import { Events } from "discord.js";
import { baseClass } from "../Base";
import { Client } from "./Client";

export class ClientVoiceManager extends baseClass {
  private revoice?: any;

  adapters = new Map();

  constructor(client: Client) {
    super(client);

    this.client.on(Events.ShardDisconnect, () => {});
  }

  // FIXME
  onVoiceServer() {}

  onVoiceStateUpdate() {}
}
