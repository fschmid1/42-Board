<script lang="ts">
  import type { NewPostComment, PostComment, PostDetails } from '../types';
  import Reactions from './Reactions.svelte';
  import { userStore, editStore } from '../stores';
  import Fa from 'svelte-fa';
  import { faTrash, faEllipsisVertical, faPen } from '@fortawesome/free-solid-svg-icons';
  import { Alert, Button, Dropdown, DropdownItem, Modal, Textarea } from 'flowbite-svelte';
  import Avatar from './Avatar.svelte';
  import SvelteMarkdown from 'svelte-markdown';
  import { trpc } from '../variables';
  import Time from 'svelte-time/src/Time.svelte';

  export let comments: PostDetails['comments'];

  let commentEditId: number;
  let text = '';
  let commentError = '';

  const deleteComment = async (comment: PostComment) => {
    await trpc.comment.delete.mutate({ id: comment.id });
    comments = comments.filter(el => el.id != comment.id);
  };

  async function editComment() {
    await trpc.comment.update.mutate({ id: commentEditId, text });
    let comment_index = comments.findIndex(el => el.id == commentEditId);
    comments[comment_index].text = text;

    text = '';
    commentEditId = 0;
  }
</script>

{#if comments}
  {#each comments as comment}
    <div class="comment relative my-10">
      <div class="absolute right-0 -top-4 flex flex-row-reverse">
        {#if comment.userId == $userStore.id}
          <div class="w-7 h-7 rounded mx-1 bg-gray-100 dark:bg-gray-900 flex justify-center items-center cursor-pointer">
            <Fa icon={faEllipsisVertical} />
          </div>
          <Dropdown class="w-12">
            <DropdownItem class="flex justify-center" on:click={() => deleteComment(comment)}><Fa icon={faTrash} /></DropdownItem>
            <DropdownItem
              class="flex justify-center"
              on:click={() => {
                text = comment.text;
                commentEditId = comment.id;
                editStore.set(true);
              }}><Fa icon={faPen} /></DropdownItem
            >
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
  <Modal title="Update Comment" bind:open={$editStore} permanent>
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
        editComment();
        commentError = '';
        editStore.set(false);
      }}
    >
      Submit
    </Button>
    <Button
      color="alternative"
      on:click={() => {
        editStore.set(false);
        text = '';
        commentEditId = 0;
      }}>Cancel</Button
    >
  </Modal>
{/if}

<style>
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
</style>
