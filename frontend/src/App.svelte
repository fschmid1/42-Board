<script>
  import svelteLogo from './assets/svelte.svg'
  import Counter from './lib/Counter.svelte'
  import Post from './lib/Post.svelte'
//   import Searchbar from './lib/Searchbar.svelte'

  import { onMount } from "svelte";
  const endpoint = "";
  let posts = ["Haskell", "Lisp", "Clojure", "Julia", "Rust", "Elixir"];
  onMount(() => {
    fetch(endpoint)
	.then(response => response.json())
	.then(result => posts = result)
  });
</script>

<main>
	<div class="header">

	</div>
	<div class="masongrid">
		{#each posts as post}
			<Post content={post} />
		{/each}
	</div>
	<div class="footer">

	</div>
</main>

<style>
	.masongrid {
	display: grid;
	grid-template-columns: 33% 33% 33%;
	margin: 0 auto;
	grid-gap: 10px;
	background-color: #fff;
	color: #ddd;
	}
</style>
