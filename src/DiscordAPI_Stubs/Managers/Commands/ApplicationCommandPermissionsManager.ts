import { BaseManager } from "../BaseManager";
import { ApplicationCommandManager } from "./ApplicationCommandManager";

export class ApplicationCommandPermissionsManager extends BaseManager {
  private manager: ApplicationCommandManager;

  constructor(manager: ApplicationCommandManager) {
    super(manager.client);

    this.manager = manager;
  }
}
