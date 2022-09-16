import { Client as RevoltClient } from "revolt.js";
import { CachedManager } from "./CachedManager";

export class RoleManager extends CachedManager<any> {
  constructor(client: RevoltClient, iterable = false) {
    super(client, null as any, iterable);
  }
}
