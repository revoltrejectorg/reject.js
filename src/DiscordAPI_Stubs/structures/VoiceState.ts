import { baseClass } from "../Base";
import { BaseChannel } from "../Channels";
import { GuildMember } from "../GuildMember";

export class VoiceState extends baseClass {
  private rejectMember: GuildMember;

  // FIXME: Revolt does not advertise the voice channel the user is in
  channel = null;

  channelId = null;

  deaf = false;

  get guild() {
    return this.rejectMember.guild;
  }

  get id() {
    return this.rejectMember.id;
  }

  get member() {
    return this.rejectMember;
  }

  mute = false;

  requestToSpeakTimestamp = null;

  selfDeaf = false;

  selfMute = false;

  selfVideo = false;

  serverDeaf = false;

  serverMute = false;

  sessionId = null;

  suppress = false;

  constructor(member: GuildMember) {
    super(member.rejectClient);

    this.rejectMember = member;
  }

  // FIXME
  async disconnect() {
    return this.rejectMember;
  }

  async edit() {
    return this;
  }

  // FIXME
  async setChannel(channel: BaseChannel, reason: string) {
    return this.rejectMember;
  }

  // FIXME
  async setDeaf(deaf: boolean, reason: string) {
    return this.rejectMember;
  }

  // FIXME
  async setMute(mute: boolean, reason: string) {
    return this.rejectMember;
  }

  async setRequestToSpeak(requestToSpeak: boolean) {
    return this;
  }

  async setSupressed(suppressed: boolean) {
    return this;
  }
}
