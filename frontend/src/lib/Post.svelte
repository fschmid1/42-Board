<script lang="ts">
  import Modal,{getModal} from './Modal.svelte'
  import Reactions from './Reactions.svelte'
  import Tags from './Tags.svelte'
  import Reply from './Reply.svelte'
  import Vote from './Vote.svelte'
  import type { Post } from '../interfaces/post.interface';
  import { apiBaseEndpoint } from '../variables'
  import { postStore } from '../stores'
	import Time from "svelte-time";
	import SvelteMarkdown from 'svelte-markdown'
	import removeMd from 'remove-markdown'

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
	text = '';
	let post_index = $postStore.findIndex(el => el._id == post._id)
	let comment = await res.json();
	$postStore[post_index].comments.push(comment);
	$postStore[post_index] = $postStore[post_index];
	}
</script>

{#if post}
<div class="post">
	<div class="head">
		<Vote votes={post.votesScore} postId={post._id}/>
		<h3 class="phead" on:click={() => getModal('bigpost' + post.name).open()}>{post.name}</h3>
		<Tags tags={post.tags} user={post.user.username} />
	</div>
	<p class="content" on:click={() => getModal('bigpost' + post.name).open()}>{removeMd(post.content)}</p>
	<div class="reac_tags" on:click={() => getModal('bigpost' + post.name).open()}>
		<Reactions reactions={post.reactions} />
	</div>
	<div class="bottom">
		<button class="comment-button" on:click={()=>getModal('add_comment' + post._id).open()}>
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
	<div class="modal-content">
		<div class="content-header">
			<h3 class="phead">{post.name}</h3>
			<Vote votes={post.votesScore} postId={post._id}/>
		</div>
		<SvelteMarkdown class="content" source="{post.content}"  on:click={() => getModal('bigpost' + post.name).open()}/>
		<div class="reac_tags">
			<Reactions reactions={post.reactions} />
			<Tags tags={post.tags} />
		</div>
		<button class="comment-button" on:click={()=>getModal('add_comment' + post._id).open()}>
			<Reply />
		</button>
	
		<Modal id={"add_comment" + post._id}>
			Want to write a new comment?
			<textarea bind:value={text} cols="35" rows="4" name="text" id="title" placeholder="type here"></textarea>
			<button class="submit" on:click={() => {
				submit()
				getModal('add_comment' + post._id).close(1)}}>
				Submit
			</button>
		</Modal>
	
		<!-- <Comments comments={post.comments} postId={post._id}/> -->
		<div class="comments">
			{#each post.comments as comment}
			<!-- <Vote votes={comment.votesScore} postId={post._id}/> -->
			<div class="comment">
				<div class="comment-header">
					<div class="user">
						<div class="avatar" style="background-image: url({comment?.user.photo});"></div>
						{comment?.user?.username}
					</div>
					<Time relative timestamp="{comment.ts}"></Time>
				</div>
				<SvelteMarkdown source="{comment?.text}"/>
			</div>
		{/each}
		</div>
	</div>
</Modal>
 
<style>

	.modal-content {
		overflow-y: scroll;
		overflow-wrap: break-word;
		width: 100%;
		max-height: 400px;
	}

	.comment-button {
		position: absolute;
		background-color: cornflowerblue;
		border-radius: 40px;
		height: 2rem;
		width: 2rem;
		bottom: 5%;
		right: 4%;
	}
  .comment {
		border: 1px solit gray;
		width: 100%;
	}
	.comments {
		width: 100%;
	}
	.content-header {
		display: flex; 
		width: 100%;
		justify-content: space-between;
		align-items:flex-end;
	}

	.comment-header {
		display:  flex;
		align-items: center;
	}

	.comment-header div {
		font-weight: bold;
		margin-right: .5rem;
		display: flex;
		align-items: center;
	}
	.submit {
		padding: 0.5rem;
	}

	.content {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-bottom: 2.5rem;
	}

	.avatar{
        line-height: 35px;
        box-sizing: border-box;
        background-size: cover !important;
        display: block;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        border-radius: 50%;
        height: 35px;
        width: 35px;
        margin: auto;
        transition: all 0.2 ease;
       
    }
	
	.post {
		grid-template-columns: auto;
		background-color: #f8f8f8;
		color: #000;
		border-radius: 5px;
		padding: 20px;
		font-size: 1rem;
		position: relative;
	}
  .content, .reac_tags, .phead {
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
