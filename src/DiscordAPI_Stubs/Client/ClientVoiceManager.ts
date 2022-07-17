import { baseClass } from "../Base";
import { Client } from "./Client";

export class ClientVoiceManager extends baseClass {
  adapters = new Map();

  constructor(client: Client) {
    super(client);

    this.client.on("SHARD_DISCONNECT", () => {});
  }

  // FIXME
  onVoiceServer(payload: any) {}

  onVoiceStateUpdate(payload: any) {}
}
