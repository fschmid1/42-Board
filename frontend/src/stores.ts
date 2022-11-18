import { writable } from 'svelte/store';
import type { Post } from './interfaces/post.interface';
import type { User } from './interfaces/user.interface';

export const userStore = writable<User>(null);

export const postStore = writable<Post[]>([]);
