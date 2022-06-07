import { Client as revoltClient } from "revolt.js";
import { Client } from "../Client/Client";

export class BaseManager {
  revoltClient: revoltClient;

  isRevolt = true;

  constructor(rClient: revoltClient) {
    this.revoltClient = rClient;
  }

  get client() {
    return new Client(this.revoltClient);
  }
}
