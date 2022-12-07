import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../../backend/src/handlers/trpc.handler';

type RouterOutput = inferRouterOutputs<AppRouter>;
export type PostList = RouterOutput['post']['list']['result'];
export type PostDetails = RouterOutput['post']['getById'];
