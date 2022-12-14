<script lang="ts">
  import { Button, Modal, Textarea, Toolbar, ToolbarButton } from 'flowbite-svelte';
  import { onDestroy, onMount } from 'svelte';
  import SvelteMarkdown from 'svelte-markdown';
  import { trpc } from '../variables';
  import Tags from './Tags.svelte';
  import Vote from './Vote.svelte';
  import { Link, useNavigate } from 'svelte-navigator';
  import Fa from 'svelte-fa';
  import { faPen } from '@fortawesome/free-solid-svg-icons';

  import { writable } from 'svelte/store';
  import type { NewPostComment, PostComment, PostDetails } from '../types';
  import { userStore, editStore } from '../stores';
  import Comments from './Comments.svelte';

  export let id;
  let post: PostDetails | undefined;

  let text = '';
  let commentEditId: number;

  let backdrop;
  let open = writable<boolean>(false);
  let commentError = '';
  const sub = open.subscribe(val => {
    if (!val && post) {
      setTimeout(() => {
        navigate('/posts');
      }, 0);
    }
  });

  const navigate = useNavigate();

  async function loadPostDetails() {
    post = (await trpc.post.getById.query({ id: Number(id) })) as any as PostDetails;
    open.set(true);
  }

  async function submit() {
    let comment: NewPostComment;
    if (!commentEditId) {
      comment = await trpc.comment.create.mutate({ id: Number(id), text });
      if (!post.comments?.length) post.comments = [];
      post.comments = [...post.comments, comment as PostComment];
    } else {
      let comment_index = post.comments.findIndex(el => el.id == commentEditId);
      post.comments[comment_index].text = text;
    }

    text = '';
    commentEditId = 0;
  }

  const handleBackdropClick = event => {
    if (event.target.classList.contains('h-modal') && !$editStore) {
      open.set(false);
    }
  };

  onMount(async () => {
    await loadPostDetails();
    setTimeout(() => {
      backdrop = document.querySelector('.h-modal');
      backdrop.addEventListener('click', handleBackdropClick);
    }, 0);
  });

  onDestroy(() => {
    sub();
    backdrop.removeEventListener('click', handleBackdropClick, true);
  });
</script>

{#if post}
  <Modal bind:open={$open} size="xl" class="relative pb-4" bind:permanent={$editStore}>
    <div class="details-content p-8">
      <div class="flex justify-between" style="width: 100%;">
        <h3 class="m-0 text-3xl font-bold flex items-center">
          {post.name}
          {#if post.userId == $userStore.id}
            <Link to="/edit/{post.id}">
              <div class="w-6 h-6">
                <Fa class="ml-4 w-4 cursor-pointer" icon={faPen} />
              </div></Link
            >
          {/if}
        </h3>
        <Vote className="mr-6" votes={post.voteScore} postId={post.id} />
      </div>
      <SvelteMarkdown class="post-content" source={post.content} />
      <div class="flex mt-2">
        <!-- <Reactions id={post.id} reactions={post.reactions} /> -->
        <Tags tags={post.tags} user={post.user.username} />
      </div>
      <div class="comments mt-4 p-4 ">
        <Comments comments={post.comments} />
        <Textarea class="-mt-4" placeholder="Write a comment" bind:value={text}>
          <div slot="footer" class="flex items-center justify-between">
            <Button
              type="submit"
              on:click={() => {
                if (text.length <= 3) {
                  commentError = 'Minium four charaters are required';
                  return;
                }
                submit();
                commentError = '';
              }}>Post comment</Button
            >
            <!-- <Toolbar embedded>
				<ToolbarButton name="Attach file"
				  ><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
					><path
					  stroke-linecap="round"
					  stroke-linejoin="round"
					  d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
					/></svg
				  ></ToolbarButton
				>
				<ToolbarButton name="Set location"
				  ><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
					><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path
					  stroke-linecap="round"
					  stroke-linejoin="round"
					  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
					/></svg
				  ></ToolbarButton
				>
				<ToolbarButton name="Upload image"
				  ><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
					><path
					  stroke-linecap="round"
					  stroke-linejoin="round"
					  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
					/></svg
				  ></ToolbarButton
				> -->
            <!-- </Toolbar> -->
          </div>
        </Textarea>
      </div>
    </div>
  </Modal>
{/if}

<style>
  .details-content {
    width: 100%;
    max-height: 550px;
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
  .post-content {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 2.5rem;
    min-height: 24px;
  }
</style>
