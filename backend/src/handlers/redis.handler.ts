import { createClient } from 'redis';
import connectRedis from 'connect-redis';
import session from 'express-session';

const RedisStore = connectRedis(session);
export const redisClient = createClient({
  url: 'redis://redis/',
  legacyMode: true
});

redisClient.connect().catch(err => console.log(err));

export const redisStore = new RedisStore({ client: redisClient });
