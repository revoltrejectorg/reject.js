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

  _add(data: Message, cache: any) {
    return super._add(data, cache);
  }

  // #region methods

  async fetch(options: string) {
    return this._fetchSingle({ message: options });
  }

  async _fetchSingle({ message }: { message: string }) {
    const rMsg = await this.rejectChannel.revoltChannel.fetchMessage(message);
    if (!rMsg) return;

    const msg = new Message(rMsg, this.client);
    return msg;
  }

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
