<script lang="ts">
  import Post from './lib/Post.svelte';
  import Header from './lib/Header.svelte';
  import { authLoginEndpoint, authStatusEndpoint, apiBaseEndpoint } from './variables';

  import { onMount } from 'svelte';
  import { filterStore, postStore, userStore } from './stores';
  import { Modal, Textarea, Button, Search, Label, Select } from 'flowbite-svelte';
    import Filter from './lib/Filter.svelte';
    import Searchbar from './lib/Searchbar.svelte';

  onMount(async () => {
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		document.getElementsByTagName('html').item(0).classList.add('dark')
	}
    try {
      let response = await fetch(authStatusEndpoint, { credentials: 'include' });

      filterStore.subscribe(filter => fetchPosts(filter));

      if (response.status === 401) {
        location.replace(authLoginEndpoint);
      }
      userStore.set(await response.json());
    } catch (error) {
      console.log(error);
    }
  });

  async function fetchPosts(options: { search: string; filter: string }) {
    let url = apiBaseEndpoint + 'posts?';
    if (options?.filter && options.filter == 'ts') {
      url += 'sortByTs=1';
    }
    if (options?.search && options.search != '') {
      if (options.filter == 'ts') url += '&';
      url += 'search=' + options.search;
    }
    const response = await fetch(url, { credentials: 'include' });
    postStore.set(await response.json());
  }

  let name = '';
  let content = '';
  let tags = [''];
  let curr_tag = '';
  let addPostModal = false;
  let tag_selection = ['', 'workshop', 'rfc', 'event', 'marketplace'];

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
    $postStore = [...$postStore, await res.json()];
  }
</script>
<Header></Header>
<main>
	<div class="flex my-4">
		<Searchbar></Searchbar>	
		<Filter></Filter>
		<Button class="ml-2" on:click={() => addPostModal = true}> + </Button>
	</div>
  <div class="masongrid">
    {#each $postStore as post}
      <Post {post} />
    {/each}
  </div>
  <Modal size="md" title="Want to write a new post?" bind:open={addPostModal} >
	<div class="flex">
		<p class="mr-2">Tag selection:</p>
		<select style="width: 12rem !important;" bind:value={curr_tag} on:change={() => (tags = [curr_tag])}>
		  {#each tag_selection as tag}
			<option value={tag}>{tag}</option>
		  {/each}
		</select>
	</div>
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
  <div class="footer" />
</main>

<style>
  .masongrid {
    display: grid;
	grid-gap: 30px;
    grid-template-columns: repeat(auto-fit, 300px);
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
