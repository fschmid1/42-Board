import { User } from './user.interface';

export interface Vote {
  user: User;
  up: boolean;
}
