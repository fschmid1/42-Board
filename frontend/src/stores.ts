import { writable } from 'svelte/store';
import type { Post } from './interfaces/post.interface';
import type { User } from './interfaces/user.interface';
import { apiBaseEndpoint } from './variables';

export const userStore = writable<User>(null);

export const postStore = writable<Post[]>([]);

export const filterStore = writable<{ search: string; filter: string; page: number }>({ search: '', filter: '', page: 1 });

filterStore.subscribe(filter => fetchPosts(filter));

async function fetchPosts(options: { search: string; filter: string; page: number }) {
  let url = apiBaseEndpoint + 'posts?';
  if (options?.filter && options.filter == 'ts') {
    url += 'sortByTs=1';
  }
  if (options?.search && options.search != '') {
    if (options.filter == 'ts') url += '&';
    url += 'search=' + options.search;
  }
  if (!url.endsWith('?'))  url += '&'
  url += `page=${options.page}`
  const response = await fetch(url, { credentials: 'include' });
  postStore.set(await response.json());
}
