<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import Counter from './lib/Counter.svelte'
  import Post from './lib/Post.svelte'
//   import Searchbar from './lib/Searchbar.svelte'

  import { onMount } from "svelte";
  import { userStore } from './stores';

  const authStatusEndpoint = "http://localhost:8080/auth/status";
  const authLoginEndpoint = "http://localhost:8080/auth/login";
	
  let posts = ["Haskell", "Lisp", "Clojure", "Julia", "Rust", "Elixir"];
  let postobs = [{"name" : "Haskell",
					 "content": "(λx.x am pure)(I)",
  					 "votesScore": 15,
					 "tags": ["workshop", "rfc", "blaBlah!"],
					 "reactions": [{"emote" : "🦄"}, {"emote" : "εїз"}],
					 "comments": [],
					 "user": {}},
				 {"name" : "Lisp",
					 "content": "Trust in the Recursion",
  					 "votesScore": 10,
					 "tags": ["workshop"],
					 "reactions": [],
					 "comments": [],
					 "user": {}},
				 {"name" : "Rust",
					 "content": "I'll be your designated driver tonight",
  					 "votesScore": 0,
					 "tags": [],
					 "reactions": [{"emote" : "🦄"}],
					 "comments": [],
					 "user": {}},]

  onMount(async () => {
		try {
			const response  = await fetch(authStatusEndpoint, { credentials: "include"});
			
			if (response.status === 401) {
				location.replace(authLoginEndpoint);
			}
			userStore.set(await response.json());
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

	</div>
	<div class="masongrid">
		{#each postobs as post}
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
</style>

