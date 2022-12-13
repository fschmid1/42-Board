import { writable } from 'svelte/store';
import type { User } from './interfaces/user.interface';
import type { PostList } from './types';
import { trpc } from './variables';

export const userStore = writable<User>(null);

export const postStore = writable<PostList>([]);

export const paginationStore = writable<{ total: number }>({ total: 0 });

export const filterStore = writable<{ search: string; filter: string; page: number }>({
  search: '',
  filter: '',
  page: 1
});

export const editStore = writable<boolean>(false);

export const authState = writable<boolean>(false);

filterStore.subscribe(filter => fetchPosts(filter));

async function fetchPosts(options: { search: string; filter: string; page: number }) {
  const { result, total } = await trpc.post.list.query({
    page: options.page,
    search: options.search,
    sortByTs: options.filter == 'ts'
  });

  paginationStore.update(value => {
    return { total: total };
  });
  postStore.set(result);
}
