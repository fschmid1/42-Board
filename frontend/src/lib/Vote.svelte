<script lang="ts">
    import { apiBaseEndpoint } from "../variables";
		import { postStore} from '../stores'


	export let votes = 0;
	export let postId;

	const doVote = async (up: boolean) => {
		const res = await fetch(apiBaseEndpoint + 'vote/posts',
		{
			headers: {
      			'Accept': 'application/json',
      			'Content-Type': 'application/json'
    		},
			method: 'POST',
			body: JSON.stringify({
				id: postId,
				up
			}),
			credentials: "include",
		});
		let index = $postStore.findIndex(el => el.id == postId)
		$postStore[index] = await res.json();
	}

	const voteUp = () => doVote(true);
	const voteDown = () => doVote(false);
</script>
  
<div class="vote">
	<button on:click={voteUp}>
		∧
	</button>
	<span>{votes}</span>
	<button on:click={voteDown}>
		∨
	</button>
</div>

 
<style>
  .vote {
	display: flex;
	flex-direction: column;
	align-items: center;
  }

  button {
	padding: 0;
  }
</style>
