import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import { PORT, DB_URL } from './vars.global';
dotenv.config();

const app = express();

app.use(express.json());

app.listen(Number(PORT), async () => {
  if (!DB_URL) {
    console.log('Set a DB_URL in your env');
    process.exit(1);
  }
  await mongoose.connect(DB_URL);
  console.log(`Server is running on Port '${PORT}' `);
});
