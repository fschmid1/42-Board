<script lang="ts">
  import Modal,{getModal} from './Modal.svelte'
  import Reactions from './Reactions.svelte'
  import Tags from './Tags.svelte'
  import Reply from './Reply.svelte'
  import Vote from './Vote.svelte'
  import type { Post } from '../interfaces/post.interface';
  import { apiBaseEndpoint } from '../variables'
  import { postStore, userStore } from '../stores'
	import Time from "svelte-time";

  export let post: Post;

  let _id = post._id;
  let text = "";

  async function submit() {
	const res = await fetch(apiBaseEndpoint + 'comments',
		{
			headers: {
      			'Accept': 'application/json',
      			'Content-Type': 'application/json'
    		},
			method: 'POST',
			body: JSON.stringify({
				_id,
				text
			}),
			credentials: "include",
		});
	let post_index = $postStore.findIndex(el => el._id === post._id)
	let comment = await res.json();
	$postStore[post_index].comments.push(comment);
	}
</script>

{#if post}
<div class="post">
	<div class="head">
		<Vote votes={post.votesScore} postId={post._id}/>
		<h3 class="phead" on:click={() => getModal('bigpost' + post.name).open()}>{post.name}</h3>
		<Tags tags={post.tags} />
	</div>
	<p class="content" on:click={() => getModal('bigpost' + post.name).open()}>{post.content}</p>
	<div class="reac_tags" on:click={() => getModal('bigpost' + post.name).open()}>
		<Reactions reactions={post.reactions} />
	</div>
	<div class="bottom">
		<button on:click={()=>getModal('add_comment' + post._id).open()}>
			<Reply />
		</button>

		<Modal id={"add_comment" + post._id}>
			Want to write a new comment?
			<textarea bind:value={text} cols="35" rows="4" name="text" id="title" placeholder="type here"></textarea>
			<button on:click={() => {
				submit()
				getModal('add_comment' + post._id).close(1)}}>
				Submit
			</button>
		</Modal>
	</div>
</div>
{/if}

<Modal id={"bigpost" + post.name}>
	<div class="content-header">
		<h3 class="phead">{post.name}</h3>
		<Vote votes={post.votesScore} postId={post._id}/>
	</div>
	<p class="content">{post.content}</p>
	<div class="reac_tags">
		<Reactions reactions={post.reactions} />
		<Tags tags={post.tags} />
	</div>
	<button on:click={()=>getModal('add_comment' + post._id).open()}>
		<Reply />
	</button>

	<Modal id={"add_comment" + post._id}>
		Want to write a new comment?
		<textarea bind:value={text} cols="35" rows="4" name="text" id="title" placeholder="type here"></textarea>
		<button on:click={() => {
			submit()
			getModal('add_comment' + post._id).close(1)}}>
			Submit
		</button>
	</Modal>

	<!-- <Comments comments={post.comments} postId={post._id}/> -->
	{#each post.comments as comment}
		<!-- <Vote votes={comment.votesScore} postId={post._id}/> -->
		<div class="comment">
			<div class="comment-header">
				<div class="user">{comment?.user?.username}</div><Time relative timestamp="{comment.ts}"></Time>
			</div>
			<p>{comment?.text}</p>
		</div>
	{/each}
</Modal>
 
<style>
  .comment {
		border: 1px solit gray;
	}

	.content-header {
		display: flex; 
		width: 100%;
		justify-content: space-between;
		align-items:flex-end;
	}

	.comment-header {
		display:  flex;
	}

	.comment-header div {
		font-weight: bold;
		margin-right: .5rem;
	}
	
	.post {
	grid-template-columns: auto;
	background-color: #f8f8f8;
	color: #000;
	border-radius: 5px;
	padding: 20px;
	font-size: 1rem;
	cursor: pointer;
  }
  h3 {
	margin-left: 10px;
	margin-right: 10px;
	min-width: 50px;
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
