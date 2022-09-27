import { Client } from "../Client";
import { CachedManager } from "./CachedManager";

export class RoleManager extends CachedManager<any> {
  constructor(client: Client, iterable = false) {
    super(client, null as any, iterable);
  }
}
