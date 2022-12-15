<script lang="ts">
  import Tags from './Tags.svelte';
  import Reply from './Reply.svelte';
  import Vote from './Vote.svelte';
  import { trpc } from '../variables';
  import { postStore } from '../stores';
  import removeMd from 'remove-markdown';

  import { Link } from 'svelte-navigator';

  import { Card, Input } from 'flowbite-svelte';
  import type { PostDetails } from '../types';

  export let post: PostDetails | undefined;

  let id = post.id;
  let text = '';

  async function submit() {
    const comment = await trpc.comment.create.mutate({
      id,
      text
    });
    text = '';
    let post_index = $postStore.findIndex(el => el.id == post.id);
    if (!post.comments?.length) post.comments = [];
    post.comments = [...post.comments, comment as any];
    $postStore[post_index] = post;
  }

  const openDetails = async () => {};
</script>

{#if post}
  <Card size="lg" cla>
    <div class="flex justify-between">
      <Vote votes={post.voteScore} postId={post.id} />
      <Link to="/posts/{post.id}" class="truncate"
        ><h3 class="text-xl text-ellipsis font-semibold mx-1 overflow-hidden cursor-pointer" on:click={() => openDetails()}>
          {post.name}
        </h3></Link
      >
      <Tags tags={post.tags} user={post.user.username} />
    </div>
    <Link to="/posts/{post.id}" class="h-26">
      <p class="text-l pt-2 line-clamp-3 mx-1 overflow-hidden cursor-pointer mb-2" on:click={() => openDetails()}>
        {removeMd(post.content)}
      </p>
    </Link>
    <div class=" relative">
      <Input class="border-none bg-gray-100 dark:bg-gray-700" type="text" name="text" bind:value={text} />
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
