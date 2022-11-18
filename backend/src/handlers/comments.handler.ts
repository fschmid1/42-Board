import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { Post } from '../models/post.model';

import { Comment } from '../interfaces/comment.interface';
import { User } from '../interfaces/user.interface';

export const router = Router();

router.use('/', isAuthenticated);

router.post('/', async (req, res, next) => {
  try {
    let post = await Post.findOne({ _id: req.body._id });
    if (!post)
      throw {
        status: 400,
        error: 'Post not found'
      };
    const data: Comment = {
      user: req.user as User,
      text: req.body.text,
      votes: [],
      votesScore: 0,
      reactions: [],
      ts: new Date().getTime(),
      replies: []
    };
    await Post.updateOne({ _id: req.body._id }, { $push: { comments: data } });
    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    let post = await Post.findOne({ _id: req.body._id, 'comments.ts': req.body.ts, 'comments.user': req.user });
    if (!post)
      throw {
        status: 400,
        error: 'Post not found'
      };
    const data = {
      text: req.body.text
    };
    await Post.updateOne({ _id: post._id, 'comments.ts': req.body.ts }, { $set: { 'comments.$': data } });
    res.send({ success: true });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id/:ts', async (req, res, next) => {
  try {
    const ts = Number(req.params.ts);
    const post = await Post.findOne({ _id: req.params.id, 'comments.ts': ts, 'comments.user': req.user });
    if (!post)
      throw {
        status: 404,
        error: 'Post not found'
      };
    await Post.updateOne(
      { _id: post._id },
      {
        $pull: {
          comments: { ts }
        }
      }
    );
    res.send({ success: true });
  } catch (error) {
    next(error);
  }
});
