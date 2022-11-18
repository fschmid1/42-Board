import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { Post } from '../models/post.model';

export const router = Router();

router.use('/', isAuthenticated);

router.get('/', async (req, res, next) => {
  try {
    res.send(await Post.find().sort('votesScore'));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post)
      throw {
        status: 404,
        error: 'Post not found'
      };
    res.send(post);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const data = {
      name: req.body.name,
      content: req.body.content,
      tags: req.body.tags,
      user: req.user
    };
    const post = await new Post(data).save();
    res.send(post);
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    let post = await Post.findOne({ _id: req.body._id });
    if (!post)
      throw {
        status: 400,
        error: 'Post not found'
      };
    const data = {
      name: req.body.name,
      content: req.body.content,
      tags: req.body.tags,
      _id: post._id
    };
    await Post.updateOne({ _id: post._id }, data);
    res.send({ ...post.toObject(), ...data });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post)
      throw {
        status: 404,
        error: 'Post not found'
      };

    res.send(await Post.deleteOne({ _id: post._id }));
  } catch (error) {
    next(error);
  }
});
