import { User } from './user.interface';

export interface Vote {
  userId: number;
  user: User;
  up: boolean;
}
