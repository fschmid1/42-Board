<script lang="ts">
  import Post from './lib/Post.svelte';
  import Header from './lib/Header.svelte';
  import { authLoginEndpoint, authStatusEndpoint, apiBaseEndpoint } from './variables';

  import { onMount } from 'svelte';
  import { postStore, userStore, filterStore } from './stores';
  import { Modal, Textarea, Button, Label, Select, Skeleton, Card, PaginationItem } from 'flowbite-svelte';
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
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
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
        <Card>
          <Skeleton />
        </Card>
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
    <div class="flex w-full justify-center mt-2 mb-4 space-x-3">
      <PaginationItem on:click={previous}>Previous</PaginationItem>
      <PaginationItem on:click={next}>Next</PaginationItem>
    </div>
    <div class="footer" />
  </main>

  <Route path="/:id" let:params>
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
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    width: 80%;
    margin: 0 auto;
  }
  @media screen and (max-width: 787px) {
    .masongrid {
      justify-content: center;
    }
  }
</style>
