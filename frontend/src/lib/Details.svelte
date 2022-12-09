<script lang="ts">
  import { Alert, Button, Modal, Textarea } from 'flowbite-svelte';
  import { onDestroy, onMount } from 'svelte';
  import SvelteMarkdown from 'svelte-markdown';
  import { trpc } from '../variables';
  import Tags from './Tags.svelte';
  import Vote from './Vote.svelte';
  import { useNavigate } from 'svelte-navigator';
  import Fa from 'svelte-fa';
  import { faPen } from '@fortawesome/free-solid-svg-icons';

  import Reply from './Reply.svelte';
  import { writable } from 'svelte/store';
  import type { NewPostComment, PostComment, PostDetails } from '../types';
  import { userStore, postStore } from '../stores';
  import Comments from './Comments.svelte';
  import PostModal from './PostModal.svelte';

  export let id;
  let post: PostDetails | undefined;

  let text = '';
  let commentEditId: number;

  let backdrop;
  let open = writable<boolean>(false);
  let commentModal = false;
  let postModal = false;
  let commentError = '';
  const sub = open.subscribe(val => {
    if (!val && post) {
      setTimeout(() => {
        navigate('/');
      }, 0);
    }
  });

  const navigate = useNavigate();

  async function loadPostDetails() {
    post = (await trpc.post.getById.query({ id: Number(id) })) as any as PostDetails;
    open.set(true);
  }

  async function updatePost({ tags, name, content }: { tags: string[]; name: string; content: string }) {
    const newPost = await trpc.post.update.mutate({
      content,
      name,
      tags,
      id: post.id
    });
    post = { ...post, name: newPost.name, content: newPost.content, tags: newPost.tags };
    const index = $postStore.findIndex(el => el.id == post.id);
    $postStore[index] = post;
    postModal = false;
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
    if (event.target.classList.contains('h-modal')) {
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
  <Modal bind:open={$open} size="xl" class="relative pb-4">
    <div class="details-content pb-4">
      <div class="flex justify-between" style="width: 100%;">
        <h3 class="m-0 text-3xl font-bold flex items-center">
          {post.name}
          {#if post.userId == $userStore.id}
            <div
              class="w-6 h-6"
              on:click={() => {
                postModal = true;
              }}
            >
              <Fa class="ml-4 w-4 cursor-pointer" icon={faPen} />
            </div>
          {/if}
        </h3>
        <Vote className="mr-6" votes={post.voteScore} postId={post.id} />
      </div>
      <SvelteMarkdown class="content" source={post.content} />
      <div class="flex mt-2">
        <!-- <Reactions id={post.id} reactions={post.reactions} /> -->
        <Tags tags={post.tags} user={post.user.username} />
      </div>
      <div class="comments mt-2 pb-4 ">
        <Comments comments={post.comments} />
      </div>
    </div>
    <button
      class="comment-button"
      on:click={() => {
        commentModal = true;
      }}
    >
      <Reply />
    </button>
  </Modal>

  {#if postModal}
    <PostModal {post} title={'Update post'} submit={updatePost} />
  {/if}

  <Modal title="Want to write a new comment?" bind:open={commentModal}>
    {#if commentError}
      <Alert color="red" dismissable accent>
        <span class="font-medium">Error!</span>
        {commentError}
      </Alert>
    {/if}
    <Textarea type="text" cols="35" rows="4" name="text" s placeholder="type here" bind:value={text} />
    <Button
      on:click={() => {
        if (text.length <= 3) {
          commentError = 'Minium four charaters are required';
          return;
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
  .content {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 2.5rem;
    min-height: 24px;
  }
</style>
