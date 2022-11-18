import { Reaction } from './reaction.interface';
import { User } from './user.interface';

export interface Post {
  _id?: string;
  name: string;
  votes: number;
  reactions: Reaction[];
  comments: Comment[];
  user: User;
  ts: number;
}
