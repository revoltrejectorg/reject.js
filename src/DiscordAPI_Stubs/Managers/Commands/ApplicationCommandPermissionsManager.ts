import { BaseManager } from "../BaseManager";
import { ApplicationCommandManager } from "./ApplicationCommandManager";

export class ApplicationCommandPermissionsManager extends BaseManager {
  private manager: ApplicationCommandManager;

  constructor(manager: ApplicationCommandManager) {
    super(manager.revoltClient);

    this.manager = manager;
  }
}
