<script lang="ts">
	import Reactions from "./Reactions.svelte";
	import Vote from "./Vote.svelte";

export let comments = [];
export let postId;
</script>
  
<div class="comments">
	{#each comments as comment}
		<Vote votes={comment.votesScore} postId={postId}/>
		<p class="text">{comment.text}</p>
		<div class="reac_tags">
			<Reactions reactions={comment.reactions}/>
		</div>
		<svelte:self comments={comment.replies} />
	{/each}
</div>
 
<style>
  /* .comments {

  } */
</style>
  