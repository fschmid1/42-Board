<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import Counter from './lib/Counter.svelte'
  import Post from './lib/Post.svelte'
  import Searchbar from './lib/Searchbar.svelte'
  import Filter from './lib/Filter.svelte'
  import Settings from './lib/Settings.svelte'

  import { onMount } from "svelte";
  import { postStore, userStore } from './stores';

  const authStatusEndpoint = "http://localhost:8080/auth/status";
  const authLoginEndpoint = "http://localhost:8080/auth/login";
  const apiBaseEndpoint = "http://localhost:8080/";
	
  let posts = ["Haskell", "Lisp", "Clojure", "Julia", "Rust", "Elixir"];

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
  function handleClick() {
		location.replace('http://localhost:8080/auth/login');
	}
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
		<button on:click={handleClick}>
			Click me
		</button>
	</div>
</main>

<style>
	.masongrid {
	display: grid;
	grid-template-columns: 33% 33% 33%;
	margin: 0 auto;
	grid-gap: 10px;
	background-color: #fff;
	color: #eee;
	}
	main {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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

