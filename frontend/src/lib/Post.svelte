<script lang="ts">
  import Reactions from './Reactions.svelte'
  import Tags from './Tags.svelte'
  import Reply from './Reply.svelte'
  import Vote from './Vote.svelte'
  import type { Post } from '../interfaces/post.interface';

  export let post: Post;
</script>

{#if post}
<div class="post">
	<div class="head">
		<Vote votes={post.votesScore}/>
		<h3 class="phead">{post.name}</h3>
		<Tags tags={post.tags} />
	</div>
	<p class="content">{post.content}</p>
	<div class="reac_tags">
		<Reactions reactions={post.reactions} />
	</div>
	<div class="bottom">
		<Reply />
	</div>
</div>
{/if}
 
<style>
  .post {
	grid-template-columns: auto;
	background-color: #f8f8f8;
	color: #000;
	border-radius: 5px;
	padding: 20px;
	font-size: 1rem;
  }
  h3 {
	margin-left: 10px;
	margin-right: 10px;
  }
  .head {
	display: flex;
	justify-content: space-between;
  }
  .reac_tags {
		display: flex;
		align-items: flex-end;
  }
</style>
