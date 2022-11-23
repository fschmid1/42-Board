import express, { Request, Response, NextFunction } from 'express';
import { registerAuthHandler } from './handlers/auth.handler';
import { router as postRouter } from './handlers/post.handler';
import { router as commentsRouter } from './handlers/comments.handler';
import { router as voteRouter } from './handlers/vote.handler';
import session from 'express-session';
import cors from 'cors';
const cookieParser = require('cookie-parser');

import { PORT, FRONT, MODE } from './vars.global';
import { redisStore } from './handlers/redis.handler';

const app = express();

app.set('trust proxy', 1); // trust first proxy
if (MODE == 'DEV') app.use(cors({ origin: FRONT, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    store: redisStore,
    secret: 'fkdisjkfijIDUHaundsais',
    resave: false,
    saveUninitialized: true,

    cookie: { secure: MODE == 'DEV' ? false : true }
  })
);

registerAuthHandler(app);
app.use('/posts', postRouter);
app.use('/comments', commentsRouter);
app.use('/vote', voteRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  // if (err._message.includes('Validation failed')) {
  //   return res.status(400).send(err.error);
  // }
  res.status(err.status ?? 500).send(err.error ?? 'Something went wrong');
});

app.listen(Number(PORT), async () => {
  console.log(`Server is running on Port '${PORT}' `);
});
