import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { Post } from '../models/post.model';

import { User } from '../interfaces/user.interface';

export const router = Router();

router.use('/', isAuthenticated);

router.post('/posts/', async (req, res, next) => {
  try {
    let post = await Post.findOne({ _id: req.body._id });

    if (!post)
      throw {
        status: 404,
        error: 'Post not found'
      };
    let vote = post?.votes.find(el => el.user._id == (req.user as User)._id);
    if (vote) {
      if (!vote.up && req.body.up) {
        post.votesScore += 2;
        vote.up = true;
      } else if (vote.up && !req.body.up) {
        post.votesScore -= 2;
        vote.up = false;
      }
    } else {
      post.votesScore += req.body.up ? 1 : -1;
      post.votes.push({ user: req.user as User, up: req.body.up });
    }

    await Post.replaceOne({ _id: post._id }, post.toObject());
    res.send(post.toObject());
  } catch (error) {
    next(error);
  }
});
