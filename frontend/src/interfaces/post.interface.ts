import type { Reaction } from './reaction.interface';
import type { User } from './user.interface';
import type { Vote } from './vote.interface';

export interface Post {
  id: number;
  name: string;
  content: string;
  votes?: Vote[];
  voteScore: number;
  tags: { value: string }[];
  reactions?: Reaction[];
  comments?: Comment[];
  user: User;
  userId: number;
  ts: string;
}
