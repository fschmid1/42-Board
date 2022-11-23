import { Reaction } from './reaction.interface';
import { User } from './user.interface';
import { Vote } from './vote.interface';

export interface Comment {
  id: number;
  ts: string;
  comment: number;
  text: string;
  user: User;
  userId: number;
  votes: Vote[];
  voteScore: number;
  reactions: Reaction[];
  replies: Comment[];
}
