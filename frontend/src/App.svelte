<script lang="ts">
  import Post from './lib/Post.svelte'
  import Searchbar from './lib/Searchbar.svelte'
  import Filter from './lib/Filter.svelte'
  import Settings from './lib/Settings.svelte'

  import { onMount } from "svelte";
  import { postStore, userStore } from './stores';

  const authStatusEndpoint = "http://localhost:8080/auth/status";
  const authLoginEndpoint = "http://localhost:8080/auth/login";
  const apiBaseEndpoint = "http://localhost:8080/";
	

  onMount(async () => {
		try {
			let response  = await fetch(authStatusEndpoint, { credentials: "include"});

			postStore.subscribe(data => (console.log(data)))
			
			if (response.status === 401) {
				location.replace(authLoginEndpoint);
			}
			userStore.set(await response.json());
			response = await fetch(apiBaseEndpoint + 'posts', { credentials: "include"});
			postStore.set(await response.json());
		} catch (error) {
			console.log(error);
		}
  });
</script>

<main>
	<div class="header">
    <div class="searchnfilter">
      <Searchbar />
      <Filter />
    </div>
    <Settings />
	</div>
	<div class="masongrid">
		{#each $postStore as post}
			<Post post={post} />
		{/each}
	</div>
	<div class="footer">
	</div>
</main>

<style>
	.masongrid {
		display: grid;
		grid-template-columns: 33% 33% 33%;
		width: 100%;
		grid-gap: 10px;
		background-color: #fff;
		color: #eee;
	}
	main {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		width: 80%;
		margin: 0 auto;
	}
  .header {
		display: flex;
		padding: 2em;
		justify-content: space-between;
  }
  .searchnfilter {
    display:flex;
  }


</style>

