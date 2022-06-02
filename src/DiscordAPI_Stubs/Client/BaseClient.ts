import { EventEmitter } from "events";
import { RejectBase } from "../Base";

export class BaseClient extends EventEmitter implements RejectBase {
  isRevolt: true = true;
}
