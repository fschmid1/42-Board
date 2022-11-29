import { User } from './user.interface';

export interface Reaction {
  id: number;
  ts: string;
  emote: string;
  users: {
    userId: number;
    user: User;
  }[];
  count: number;
}
