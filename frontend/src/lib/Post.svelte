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
	<Vote votes={post.votesScore}/>
	<h3 class="phead">{post.name}</h3>
	<p class="content">{post.content}</p>
	<div class="reac_tags">
		<Reactions reactions={post.reactions} />
		<Tags tags={post.tags} />
	</div>
	<Reply />
</div>
{/if}
 
<style>
  .post {
	background-color: #f8f8f8;
	color: #000;
	border-radius: 5px;
	padding: 20px;
	font-size: 1rem;
  }
  .reac_tags {
		display: flex;
  }
</style>
