import { Reaction } from './reaction.interface';
import { User } from './user.interface';

export interface Comment {
  ts: number;
  text: string;
  user: User;
  votes: number;
  reactions: Reaction[];
  replies: Comment[];
}
