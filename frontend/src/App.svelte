<script lang="ts">
  import Modal,{getModal} from './lib/Modal.svelte'
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
	
	let selection;
	let name = "";
	let content = "";
	let tags = [""];
	
	// Callback function provided to the `open` function, it receives the value given to the `close` function call, or `undefined` if the Modal was closed with escape or clicking the X, etc.
	function setSelection(res){
		selection = res;
	}
	
	async function submit() {
	const res = await fetch(apiBaseEndpoint + 'posts',
		{
			headers: {
      			'Accept': 'application/json',
      			'Content-Type': 'application/json'
    		},
			method: 'POST',
			body: JSON.stringify({
				name,
				content,
				tags
			}),
			credentials: "include",
		});
	$postStore = [...$postStore, await res.json()];
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
	<button on:click={()=>getModal().open()}>
		+
	</button>

	<Modal>
		Want to write a new post?
		<textarea bind:value={name} cols="35" rows="1" name="text" id="title" placeholder="What do you want to call it?"></textarea>
		<textarea bind:value={content} cols="35" rows="4" name="text" id="body" placeholder="What is it exactly about?"></textarea>
		<button on:click={() => {
			submit()
			getModal().close(1)}}>
			Submit
		</button>
		
	</Modal>
	<div class="footer">
	</div>
</main>

<style>
	.masongrid {
		display: grid;
		grid-template-columns: 33% 33% 33%;
		width: 100%;
		grid-gap: 10px;
		background-color: transparent;
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
  textarea {
   background-image: linear-gradient(hsl(190,10%,98%), hsl(190,10%,94%)); 
   padding:1ex;
   font-size:1em;
   box-sizing:border-box;
   color:navy;
}
</style>

