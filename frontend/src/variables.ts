import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

import type { AppRouter } from '../../backend/src/handlers/trpc.handler';

let base = 'http://localhost:8080';

export const authStatusEndpoint = base + '/auth/status';
export const authLoginEndpoint = base + '/auth/login';
export const apiBaseEndpoint = base + '/';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: apiBaseEndpoint + 'trpc',
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include'
        });
      }
    })
  ]
});
