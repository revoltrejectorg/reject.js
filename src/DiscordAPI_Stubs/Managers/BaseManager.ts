import { Client as RevoltClient } from "revolt.js";
import { Client } from "../Client/Client";

export class BaseManager {
  isRevolt = true;

  client: Client;

  revoltClient: RevoltClient;

  constructor(client: Client) {
    this.client = client;
    this.revoltClient = client.revoltClient;
  }
}
