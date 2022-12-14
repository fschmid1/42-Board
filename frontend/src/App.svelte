<script lang="ts">
  import Header from './lib/Header.svelte';
  import { authStatusEndpoint, trpc } from './variables';

  import { onMount } from 'svelte';
  import { postStore, userStore, authState } from './stores';
  import { Button } from 'flowbite-svelte';
  import Filter from './lib/Filter.svelte';
  import Searchbar from './lib/Searchbar.svelte';
  import { Router, Route, Link } from 'svelte-navigator';
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
      let response = await fetch(authStatusEndpoint, { credentials: 'include' });

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

  async function submit({ tags, name, content }: { tags: string[]; name: string; content: string }) {
    const newPost = await trpc.post.create.mutate({
      content,
      name,
      tags
    });
    $postStore = [...$postStore, newPost];
  }
</script>

<Header />
<Router>
  <main>
    <div class="flex flex-col justify-between my-4 md:flex-row">
      <Searchbar />
      <div class="flex mt-2 w-full md:w-1/2 md:pl-2 md:mt-0">
        <Filter />
        <Link to="/edit/-1"><Button class="ml-2">+</Button></Link>
      </div>
    </div>
    <Route primary={false} path="/edit/:id" let:params>
      <PostForm id={params.id} />
    </Route>
    <Route default primary={false} path="/posts/*" component={PostList} />
    <div class="footer" />
  </main>
  <Route component={Redirects} />
  <Route primary={false} path="/login" component={Login} />
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
