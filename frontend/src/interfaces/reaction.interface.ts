import { User } from './user.interface';

export interface Reaction {
  id: number;
  ts: string;
  emote: string;
  user: User;
  userId: number;
}
