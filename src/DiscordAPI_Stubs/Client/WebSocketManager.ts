import EventEmitter from "events";
import { Client } from "./Client";

// eslint is complaining about this, but it's not a real error.
// eslint-disable-next-line no-shadow
export enum WsStatus {
  Ready,
  Connecting,
  Reconnecting,
  Idle,
  Nearly,
  Disconnected,
  WaitingForGuilds,
  Identifying,
  Resuming,
}

export class WebSocketManager extends EventEmitter {
  protected client: Client;

  status: WsStatus = WsStatus.Idle;

  gateway = null;

  get ping() {
    return 0;
  }

  constructor(client: Client) {
    super();
    this.client = client;
  }

  async connect() {}

  triggerClientReady() {
    this.status = WsStatus.Ready;

    this.client.readyTimestamp = Date.now();

    this.client.emit("ready", this.client);
  }
}
