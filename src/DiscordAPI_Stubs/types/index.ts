import { GuildMember } from "../GuildMember";
import { Message } from "../Message";
import { User } from "../User";

export type Snowflake = string;

export type UserResolvable = User | Snowflake | Message | GuildMember;

export type GuildMemberResolvable = UserResolvable | GuildMember;
