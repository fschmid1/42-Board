import { Reaction } from './reaction.interface';
import { User } from './user.interface';
import { Vote } from './vote.interface';

export interface Comment {
  ts: number;
  text: string;
  user: User;
  votes: Vote[];
  votesScore: number;
  reactions: Reaction[];
  replies: Comment[];
}
