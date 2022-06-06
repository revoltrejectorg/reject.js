import { Application } from "../structures/interfaces";
import { User } from "../User";

export class ClientApplication extends Application {
  get botPublic() { return this.rejectClient.user?.bot; }

  get botRequireCodeGrant() { return false; }

  get commands() { return []; }

  // FIXME: No clue what this is for
  flags = this.revoltClient.user?.flags;

  get owner() {
    if (this.revoltClient.user?.bot?.owner) return new User(this.revoltClient.user);
    return null;
  }

  get cover() {
    return this.coverURL();
  }

  get partial() {
    return !this.name;
  }

  rpcOrigins?: never;
}
