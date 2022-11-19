<script lang="ts">
  import Modal,{getModal} from './lib/Modal.svelte'
  import Post from './lib/Post.svelte'
  import Searchbar from './lib/Searchbar.svelte'
  import Filter from './lib/Filter.svelte'
  import Settings from './lib/Settings.svelte'
  import { authLoginEndpoint, authStatusEndpoint, apiBaseEndpoint } from './variables'

  import { onMount } from "svelte";
  import { filterStore, postStore, userStore } from './stores';

  onMount(async () => {
		try {
			let response  = await fetch(authStatusEndpoint, { credentials: "include"});

			filterStore.subscribe(filter => fetchPosts(filter));
			
			if (response.status === 401) {
				location.replace(authLoginEndpoint);
			}
			userStore.set(await response.json());
		} catch (error) {
			console.log(error);
		}
  });

	async function fetchPosts(options: {search: string, filter: string}) {
		let url = apiBaseEndpoint + 'posts?';
		if (options?.filter &&options.filter == 'ts') {
			url += 'sortByTs=1'
		}
		if (options?.search && options.search != '') {
			if (options.filter == 'ts')
			url += '&'
			url += 'search=' + options.search;
		}
		const response = await fetch(url, { credentials: "include"});
		postStore.set(await response.json());
	}
	
	let selection;
	let name = "";
	let content = "";
	let tags = [""];
	let curr_tag = "";
	let	tag_selection = ["", "workshop", "rfc", "event", "marketplace"];

	
	// Callback function provided to the `open` function, it receives the value given to the `close` function call, or `undefined` if the Modal was closed with escape or clicking the X, etc.
	function setSelection(res){
		selection = res;
	}
	
	async function submit() {
		let url = apiBaseEndpoint + 'posts';
		const res = await fetch(url,
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
		<button class="add-button" on:click={()=>getModal('add_post').open()}>
			+
		</button>
	
		{#each $postStore as post}
			<Post post={post} />
		{/each}
	</div>
	<Modal id="add_post">
		Want to write a new post?
		<p>Tag selection: </p>
		<select bind:value={curr_tag} on:change={() => tags = [curr_tag]} >
			{#each tag_selection as tag}
				<option value={tag}>{tag}</option>
			{/each}
		</select>
		<textarea bind:value={name} cols="35" rows="1" name="text" id="title" placeholder="What do you want to call it?"></textarea>
		<textarea bind:value={content} cols="35" rows="4" name="text" id="body" placeholder="What is it exactly about?"></textarea>
		<button class="submit" on:click={() => {
			submit()
			getModal('add_post').close(1)}}>
			Submit
		</button>
		
	</Modal>
	<div class="footer">
	</div>
</main>

<style>
	.masongrid {
		padding-top: 50px;
		display: grid;
		grid-template-columns: 33% 33% 33%;
		width: 100%;
		grid-gap: 10px;
		background-color: transparent;
		color: #eee;
		position: relative;
	}

	.add-button {
		position: absolute;
		padding: 0.5rem;
		right: -3%;
		top: -6%;
		font-size: xx-large;
	}
	.submit {
		padding: 0.5rem;
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
select {
        border-radius: 8px;
        border: 1px solid transparent;
        width: 80px;
        background-color: transparent;
    }

    p {
        font-size: 14px;
        margin-left: 1em;
    }
</style>

