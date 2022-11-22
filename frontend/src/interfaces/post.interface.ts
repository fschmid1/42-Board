import { Reaction } from './reaction.interface';
import { User } from './user.interface';
import { Vote } from './vote.interface';

export interface Post {
  id: number;
  name: string;
  content: string;
  votes: Vote[];
  votesScore: number;
  tags: { value: string }[];
  reactions: Reaction[];
  comments: Comment[];
  user: User;
  userId: number;
  ts: string;
}
