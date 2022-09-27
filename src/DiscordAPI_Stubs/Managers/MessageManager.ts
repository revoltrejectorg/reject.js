import { BaseChannel } from "../Channels";
import { Collection } from "../DiscordJS_Stubs";
import { Message } from "../Message";
import { CachedManager } from "./CachedManager";

export class MessageManager extends CachedManager<Message> {
  protected rejectChannel: BaseChannel;

  get channel() {
    return this.rejectChannel;
  }

  constructor(channel: BaseChannel, iterable: boolean) {
    super(channel.rejectClient, Message as any, iterable);

    this.rejectChannel = channel;
  }

  _add(data: Collection<string, Message>, cache: any) {
    return super._add(data, cache);
  }

  // #region methods

  // STUB
  async fetchPinned() {
    return new Collection();
  }

  // FIXME
  async pin(message: string, reason: string) {
    const msg = this.resolveId(message);
  }

  // FIXME
  async unpin(message: string, reason: string) {
    const msg = this.resolveId(message);
  }

  // #endregion
}
