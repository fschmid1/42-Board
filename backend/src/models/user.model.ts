import { model } from 'mongoose';
import { User as IUser } from '../interfaces/user.interface';

export const userSchema: any = {
  username: { type: String, required: true },
  intraId: { type: String, required: true },
  displayName: { type: String, required: true },
  name: {
    familyName: { type: String, required: true },
    givenName: { type: String, required: true }
  },
  profileUrl: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  photo: { type: String, required: true }
};

export const User = model<IUser>('User', userSchema);
