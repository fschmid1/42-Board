import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../../backend/src/handlers/trpc.handler';

type RouterOutput = inferRouterOutputs<AppRouter>;
type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
export type PostList = RouterOutput['post']['list']['result'];
export type PostListItem = ArrayElement<PostList>;
export type PostDetails = RouterOutput['post']['getById'];
