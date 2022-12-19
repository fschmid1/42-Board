<script lang="ts">
  import Header from './lib/Header.svelte';
  import { authStatusEndpoint, trpc } from './variables';

  import { onMount } from 'svelte';
  import { userStore, authState } from './stores';
  import { Router, Route } from 'svelte-navigator';
  import Login from './lib/Login.svelte';
  import PostForm from './lib/PostForm.svelte';
  import PostList from './lib/PostList.svelte';
  import Redirects from './lib/Redirects.svelte';

  onMount(async () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('dark')) {
      console.log('dark bro');

      localStorage.setItem('dark', 'true');
    } else if (window.matchMedia && !window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('dark')) {
      localStorage.setItem('dark', 'false');
    }
    if (localStorage.getItem('dark') == 'true') {
      document.getElementsByTagName('html').item(0).classList.add('dark');
    }
    try {
      if (location.pathname == '/login') return;
      let response;
      for (let i = 0; i < 3; i++) {
        response = await fetch(authStatusEndpoint, { credentials: 'include' });
        if (response.status === 200) break;
        await wait(200);
      }

      if (response.status === 200) {
        authState.set(true);
      } else {
        location.href = '/login';
      }
      userStore.set(await response.json());
    } catch (error) {
      console.log(error);
    }
  });

  const wait = async (delay: number) => {
    return new Promise(resolve => setTimeout(resolve, delay));
  };
</script>

<Header />
<Router>
  <main>
    <Route primary={false} path="/edit/:id" let:params>
      <PostForm id={params.id} />
    </Route>
    <Route default primary={false} path="/posts/*"><PostList /></Route>
    <div class="footer" />
  </main>
  <Route>
    <Redirects />
  </Route>
  <Route primary={false} path="/login">
    <Login />
  </Route>
</Router>

<style>
  main {
    width: 80%;
    margin: 0 auto;
  }
  @media screen and (max-width: 787px) {
    .masongrid {
      justify-content: center;
    }
  }
</style>
