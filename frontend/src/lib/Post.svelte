<script lang="ts">
  import Reactions from './Reactions.svelte';
  import Tags from './Tags.svelte';
  import Reply from './Reply.svelte';
  import Vote from './Vote.svelte';
  import type { Post } from '../interfaces/post.interface';
  import { apiBaseEndpoint } from '../variables';
  import { postStore } from '../stores';
  import Time from 'svelte-time';
  import SvelteMarkdown from 'svelte-markdown';
  import removeMd from 'remove-markdown';

  import { Card, Textarea, Modal, Input, Button, Alert } from "flowbite-svelte";
    import Avatar from './Avatar.svelte';

  export let post: Post;

  let id = post.id;
  let text = '';
  let detailModal = false;
  let commentModal = false;
  let commentError = '';

  async function loadPostDetails() {
    const res = await fetch(apiBaseEndpoint + 'posts/' + post.id, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'GET',
      credentials: 'include'
    });
    post = await res.json();
  }

  async function submit() {
    const res = await fetch(apiBaseEndpoint + 'comments', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        id,
        text
      }),
      credentials: 'include'
    });
    text = '';
    let post_index = $postStore.findIndex(el => el.id == post.id);
    let comment = await res.json();
    if (!post.comments?.length) post.comments = [];
    post.comments.push(comment);
    $postStore[post_index] = post;
  }

  const openDetails = async () => {
    await loadPostDetails();
    // getModal('bigpost' + post.name).open();
	detailModal = true;
  };
</script>

{#if post}
<Card>
	<div class="flex justify-between">
		<Vote votes={post.voteScore} postId={post.id} />
		<h3 class="truncate mx-1 text-ellipsis overflow-hidden" on:click={() => openDetails()}>{post.name}</h3>
		<Tags tags={post.tags} user={post.user.username} />
	</div>
	<p class="content" on:click={() => openDetails()}>{removeMd(post.content)}</p>
	<div class="bottom-0 relative">
		<Input type="text" name="text"  bind:value={text} />
		<button class="h-8 w-8 bg-blue-500 rounded-full absolute" style="right: -0.5rem; bottom: -0.75rem" on:click={() => {
			 if (text.length <= 3)
			 	return;
			 submit();
		}}>
		  <Reply />
		</button>
	</div>
</Card>

<Modal bind:open={detailModal} size="lg" class="relative pb-4">
	<!-- <div class="relative pb-4"> -->
		<div class="details-content pb-4">
			<div class="flex justify-between" style="width: 100%;">
				<h3 class="m-0 font-bold"> {post.name}</h3>
				<Vote className="mr-6" votes={post.voteScore} postId={post.id} />
			</div>
			<SvelteMarkdown class="content" source={post.content}  />
			<div class="flex mt-2">
				<Reactions reactions={post.reactions} />
				<Tags tags={post.tags} user={post.user.username} />
			  </div>
			<div class="comments mt-2">
				{#if post.comments}
				  {#each post.comments as comment}
					<div class="comment mb-2">
					  <div class="comment-header">
						<div class="user">
							<Avatar src="{comment.user?.photoUrl}" size="8" className="!mr-1" />
						  {comment?.user?.username}
						</div>
						<Time relative timestamp={comment.ts} />
					  </div>
					  <SvelteMarkdown source={comment?.text} />
					</div>
				  {/each}
				{/if}
			  </div>
		</div>
		<button class="comment-button" on:click={() => {
			commentModal = true
		}}>
			<Reply />
		</button>

	<!-- </div> -->
  </Modal>

  <Modal title="Want to write a new comment?" bind:open={commentModal}>
	{#if commentError}
		<Alert color="red" dismissable accent>
			<span class="font-medium">Error!</span> {commentError}
		</Alert>
	{/if}
	<Textarea type="text" cols="35" rows="4" name="text" s placeholder="type here"  bind:value={text} />
	<Button
	  on:click={() => {
		if (text.length <= 3) {
			commentError = 'Minium three charaters are required'
			return
		}
		submit();
		commentError = '';
		commentModal = false;
	  }}
	>
	  Submit
	</Button>
  </Modal>
{/if}


<style>
  .details-content {
    width: 100%;
    max-height: 400px;
	overflow-wrap: break-word;
  }

  .comment-button {
    position: absolute;
    background-color: cornflowerblue;
    border-radius: 40px;
    height: 2rem;
    width: 2rem;
    bottom: 10px;
    right: 1rem;
  }
  .comment {
    border: 1px solit gray;
    width: 100%;
  }

  .comment-header {
    display: flex;
    align-items: center;
  }

  .comment-header div {
    font-weight: bold;
    margin-right: 0.5rem;
    display: flex;
    align-items: center;
  }
  .content {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 2.5rem;
	min-height: 24px;
  }
</style>
