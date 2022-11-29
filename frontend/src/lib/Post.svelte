<script lang="ts">
  import Tags from './Tags.svelte';
  import Reply from './Reply.svelte';
  import Vote from './Vote.svelte';
  import type { Post } from '../interfaces/post.interface';
  import { apiBaseEndpoint } from '../variables';
  import { postStore } from '../stores';
  import removeMd from 'remove-markdown';

  import { Link } from 'svelte-navigator';

  import { Card, Input } from 'flowbite-svelte';

  export let post: Post;

  let id = post.id;
  let text = '';

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

  const openDetails = async () => {};
</script>

{#if post}
  <Card>
    <div class="flex justify-between">
      <Vote votes={post.voteScore} postId={post.id} />
      <Link to="/{post.id}"
        ><h3 class="truncate mx-1 text-ellipsis overflow-hidden cursor-pointer" on:click={() => openDetails()}>
          {post.name}
        </h3></Link
      >
      <Tags tags={post.tags} user={post.user.username} />
    </div>
    <Link to="/{post.id}">
      <p class="content cursor-pointer" on:click={() => openDetails()}>{removeMd(post.content)}</p>
    </Link>
    <div class="bottom-0 relative">
      <Input type="text" name="text" bind:value={text} />
      <button
        class="h-8 w-8 bg-blue-500 rounded-full absolute"
        style="right: -0.9rem; bottom: -0.9rem"
        on:click={() => {
          if (text.length <= 3) return;
          submit();
        }}
      >
        <Reply />
      </button>
    </div>
  </Card>
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
