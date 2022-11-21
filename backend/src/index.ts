import express, { Request, Response, NextFunction } from 'express';
import { registerAuthHandler } from './handlers/auth.handler';
import { router as postRouter } from './handlers/post.handler';
// import { router as commentsRouter } from '../comments.handler';
// import { router as voteRouter } from './handlers/vote.handler';
import session from 'express-session';
import cors from 'cors';
const cookieParser = require('cookie-parser');

import { PORT, FRONT, MODE } from './vars.global';

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

    cookie: { secure: MODE == 'DEV' ? false : true, sameSite: MODE == 'DEV' ? false : 'none' }
  })
);

registerAuthHandler(app);
app.use('/posts', postRouter);
// app.use('/comments', commentsRouter);
// app.use('/vote', voteRouter);

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
