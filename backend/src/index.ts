import express from 'express';
import mongoose from 'mongoose';
import { registerAuthHandler } from './handlers/auth.handler';
import session from 'express-session';
var cookieParser = require('cookie-parser');

import { PORT, DB_URL } from './vars.global';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: 'fkdisjkfijIDUHaundsais',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

registerAuthHandler(app);

app.listen(Number(PORT), async () => {
  if (!DB_URL) {
    console.log('Set a DB_URL in your env');
    process.exit(1);
  }
  await mongoose.connect(DB_URL);
  console.log(`Server is running on Port '${PORT}' `);
});
