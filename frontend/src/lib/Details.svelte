<script lang="ts">
  import { Alert, Button, Modal, Dropdown, Textarea, DropdownItem } from 'flowbite-svelte';
  import { onDestroy, onMount } from 'svelte';
  import SvelteMarkdown from 'svelte-markdown';
  import Time from 'svelte-time';
  import { trpc } from '../variables';
  import Avatar from './Avatar.svelte';
  import Reactions from './Reactions.svelte';
  import Tags from './Tags.svelte';
  import Vote from './Vote.svelte';
  import { useNavigate } from 'svelte-navigator';

  import { postStore } from '../stores';
  import Reply from './Reply.svelte';
  import { writable } from 'svelte/store';
  import type { PostComment, PostDetails } from '../types';
  import { userStore } from '../stores';

  import Fa from 'svelte-fa';
  import { faTrash, faEllipsisVertical, faPen } from '@fortawesome/free-solid-svg-icons';

  export let id;
  let post: PostDetails | undefined;
  let text = '';
  let backdrop;
  let open = writable<boolean>(false);
  let commentModal = false;
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

  async function submit() {
    const comment = await trpc.comment.create.mutate({ id: Number(id), text });
    text = '';

    let post_index = $postStore.findIndex(el => el.id == post.id);
    if (!post.comments?.length) post.comments = [];
    post.comments = [...post.comments, comment as any];
    $postStore[post_index] = post;
  }

  const handleBackdropClick = event => {
    if (event.target.classList.contains('h-modal')) {
      open.set(false);
    }
  };

  const deleteComment = async (comment: PostComment) => {
    await trpc.comment.delete.mutate({ id: comment.id });
    post.comments = post.comments.filter(el => el.id != comment.id);
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
        <h3 class="m-0 text-3xl font-bold">{post.name}</h3>
        <Vote className="mr-6" votes={post.voteScore} postId={post.id} />
      </div>
      <SvelteMarkdown class="content" source={post.content} />
      <div class="flex mt-2">
        <!-- <Reactions id={post.id} reactions={post.reactions} /> -->
        <Tags tags={post.tags} user={post.user.username} />
      </div>
      <div class="comments mt-2">
        {#if post.comments}
          {#each post.comments as comment}
            <div class="comment relative my-4">
              <div class="absolute right-0 -top-4 flex flex-row-reverse">
                {#if comment.userId == $userStore.id}
                  <div class="w-7 h-7 rounded mx-1 bg-gray-100 dark:bg-gray-900 flex justify-center items-center cursor-pointer">
                    <Fa icon={faEllipsisVertical} />
                  </div>
                  <Dropdown class="w-12">
                    <DropdownItem class="flex justify-center" on:click={() => deleteComment(comment)}
                      ><Fa icon={faTrash} /></DropdownItem
                    >
                    <!-- <DropdownItem class="flex justify-center"><Fa icon={faPen} /></DropdownItem> -->
                  </Dropdown>
                {/if}
                <Reactions id={comment.id} reactions={comment.reactions} />
              </div>

              <div class="comment-header my-2">
                <div class="user">
                  <Avatar src={comment.user?.photoUrl} size="8" className="!mr-1 pr-2" />
                  {comment?.user?.username}
                </div>
                <Time relative timestamp={comment.ts} />
              </div>
              <div class="ml-4">
                <SvelteMarkdown source={comment?.text} />
              </div>
            </div>
          {/each}
        {/if}
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
