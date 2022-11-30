<script lang="ts">
  import Post from './lib/Post.svelte';
  import Header from './lib/Header.svelte';
  import { authLoginEndpoint, authStatusEndpoint, apiBaseEndpoint } from './variables';

  import { onMount } from 'svelte';
  import { postStore, userStore, filterStore, paginationStore } from './stores';
  import { Modal, Textarea, Button, Label, Select, Skeleton, Card, PaginationItem, Pagination } from 'flowbite-svelte';
  import Filter from './lib/Filter.svelte';
  import Searchbar from './lib/Searchbar.svelte';
  import { Router, Route } from 'svelte-navigator';
  import Details from './lib/Details.svelte';

  const previous = () => {
    const page = $filterStore.page;
    if (page == 1) return;
    filterStore.set({ ...$filterStore, page: page - 1 });
  };
  const next = () => {
    const page = $filterStore.page;
    filterStore.set({ ...$filterStore, page: page + 1 });
  };

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
      let response = await fetch(authStatusEndpoint, { credentials: 'include' });

      if (response.status === 401) {
        location.replace(authLoginEndpoint);
      }
      userStore.set(await response.json());
    } catch (error) {
      console.log(error);
    }
  });

  let name = '';
  let content = '';
  let tags = [''];
  let curr_tag = '';
  let addPostModal = false;
  let tag_selection = ['', 'workshop', 'rfc', 'event', 'marketplace'].map(el => ({ name: el, value: el }));
  let helper = { start: 1, end: 10, total: 100 };

  async function submit() {
    let url = apiBaseEndpoint + 'posts';
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        name,
        content,
        tags
      }),
      credentials: 'include'
    });
    name = '';
    content = '';
    tags = [''];
    curr_tag = '';
    $postStore = [...$postStore, await res.json()];
  }
</script>

<Header />
<Router>
  <main>
    <div class="flex flex-col justify-between my-4 md:flex-row">
      <Searchbar />
      <div class="flex mt-2 w-full md:w-1/2 md:pl-2 md:mt-0">
        <Filter />
        <Button class="ml-2" on:click={() => (addPostModal = true)}>+</Button>
      </div>
    </div>
    <div class="masongrid">
      {#if $postStore.length == 0}
        {#each new Array(12) as d}
          <Card>
            <Skeleton />
          </Card>
        {/each}
      {/if}
      {#each $postStore as post}
        <Post {post} />
      {/each}
    </div>
    <Modal size="md" title="Want to write a new post?" bind:open={addPostModal}>
      <Label for="select-lg"
        >Tags:
        <Select
          id="select-lg"
          class="mt-2"
          size="md"
          items={tag_selection}
          bind:value={curr_tag}
          on:change={() => (tags = [curr_tag])}
        />
      </Label>

      <Textarea
        class="name"
        bind:value={name}
        cols="35"
        rows="1"
        name="text"
        id="title"
        placeholder="What do you want to call it?"
      />
      <Textarea
        class="content"
        bind:value={content}
        cols="35"
        rows="4"
        name="text"
        id="body"
        placeholder="What is it exactly about?"
      />
      <Button
        class="submit"
        on:click={() => {
          submit();
          addPostModal = false;
        }}
      >
        Submit
      </Button>
    </Modal>
    <div class="mt-2 mb-4 flex w-full justify-center">
      <div class="flex flex-col items-center justify-center">
        <div class="text-sm text-gray-700 dark:text-gray-400">
          Showing <span class="font-semibold text-gray-900 dark:text-white">{1 + 12 * ($filterStore.page - 1)}</span> to
          <span class="font-semibold text-gray-900 dark:text-white"
            >{1 + 12 * ($filterStore.page - 1) + $postStore.length - 1}</span
          >
          of <span class="font-semibold text-gray-900 dark:text-white">{$paginationStore.total}</span> Entries
        </div>
        <Pagination table>
          <div slot="prev" class="flex items-center gap-2" on:click={previous}>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
              ><path
                fill-rule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                clip-rule="evenodd"
              /></svg
            >
            Prev
          </div>
          <div slot="next" class="flex items-center gap-2" on:click={next}>
            Next
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
              ><path
                fill-rule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              /></svg
            >
          </div>
        </Pagination>
      </div>
      <div class="footer" />
    </div>
  </main>

  <Route primary={false} path="/:id" let:params>
    <Details id={params.id} />
  </Route>
</Router>

<style>
  .masongrid {
    display: grid;
    grid-gap: 30px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 400px));
    justify-content: center;
    width: 100%;
    margin: 0 auto;
    background-color: transparent;
    color: #eee;
    position: relative;
  }

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
