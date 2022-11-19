import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { registerAuthHandler } from './handlers/auth.handler';
import { router as postRouter } from './handlers/post.handler';
import { router as commentsRouter } from './handlers/comments.handler';
import { router as voteRouter } from './handlers/vote.handler';
import session from 'express-session';
import cors from 'cors';
const cookieParser = require('cookie-parser');

import { PORT, DB_URL, FRONT } from './vars.global';

const app = express();

app.set('trust proxy', 1); // trust first proxy

app.use(cors({ origin: FRONT, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: 'fkdisjkfijIDUHaundsais',
    resave: false,
    saveUninitialized: true,

    cookie: { secure: true, sameSite: 'none' }
  })
);

registerAuthHandler(app);
app.use('/posts', postRouter);
app.use('/comments', commentsRouter);
app.use('/vote', voteRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (err._message.includes('Validation failed')) {
    return res.status(400).send(err.error);
  }
  res.status(err.status ?? 500).send(err.error ?? 'Something went wrong');
});

app.listen(Number(PORT), async () => {
  if (!DB_URL) {
    console.log('Set a DB_URL in your env');
    process.exit(1);
  }
  await mongoose.connect(DB_URL);
  console.log(`Server is running on Port '${PORT}' `);
});
