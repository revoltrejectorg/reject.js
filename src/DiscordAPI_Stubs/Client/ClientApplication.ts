import { ApplicationCommandManager } from "../Managers";
import { Application } from "../structures/interfaces";
import { User } from "../User";

export class ClientApplication extends Application {
  get botPublic() { return this.rejectClient.user?.bot; }

  get botRequireCodeGrant() { return false; }

  commands = new ApplicationCommandManager(this.rejectClient, false);

  // FIXME: No clue what this is for
  flags = this.revoltClient.user?.flags;

  get owner() {
    const ownerId = this.revoltClient.user?.bot?.owner;
    if (!ownerId) return null;

    const owner = this.revoltClient.users.$get(ownerId);
    return new User(owner, this.rejectClient);
  }

  get cover() {
    return this.coverURL();
  }

  get partial() {
    return !this.name;
  }

  rpcOrigins?: never;
}
