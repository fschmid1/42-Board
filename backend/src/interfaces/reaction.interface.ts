import { User } from './user.interface';

export interface Reaction {
  ts: number;
  emote: string;
  user: User;
}
