import { Client as revoltClient } from "revolt.js";
import { Client } from "../../Client";

export class BaseManager {
  protected revoltClient: revoltClient;

  isRevolt = true;

  constructor(rClient: revoltClient) {
    this.revoltClient = rClient;
  }

  get client() {
    return new Client(this.revoltClient);
  }
}
