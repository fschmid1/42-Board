import { model, Schema } from 'mongoose';
import { Post as IPost } from '../interfaces/post.interface';
import { Reaction as IReaction } from '../interfaces/reaction.interface';
import { userSchema } from './user.model';

const createTs = () => {
  return new Date().getTime();
};

const reactionSchema = {
  emote: { type: String, required: true },
  ts: {
    type: Number,
    default: createTs
  },
  user: userSchema
};

const commentsSchema = {
  text: { type: String, required: true },
  ts: {
    type: Number,
    default: createTs
  },
  user: userSchema
};

const votesSchema = {
  text: { type: String, required: true },
  ts: {
    type: Number,
    default: createTs
  },
  user: userSchema
};

const postSchema = new Schema<IPost>({
  name: { type: String, required: true },
  votes: { type: Number, default: 0 },
  reactions: { type: [reactionSchema], default: [] },
  comments: {type.}
  user: userSchema,
  ts: {
    type: Number,
    default: createTs
  }
});

const User = model<IPost>('User', postSchema);
