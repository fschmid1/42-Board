<script lang="ts">
  import { Popover } from 'flowbite-svelte';
  import { trpc } from '../variables';
  import EmojiSelector from 'svelte-emoji-selector';
  import Avatar from './Avatar.svelte';
  import type { PostCommentReaction } from '../types';

  export let id;
  export let reactions: PostCommentReaction = [];

  const submit = async emote => {
    const res = await trpc.reaction.comment.mutate({
      emote: emote.detail,
      id
    });
    reactions = res;
  };
</script>

{#if reactions}
  <div class="flex justify-end">
    {#each reactions as r}
      <Popover class="w-44" title={r.emote} trigger="hover" triggeredBy="#reaction-{r.id}">
        <div class="flex flex-col">
          {#each r.users as user}
            <div class="flex w-fit justify-star">
              <Avatar size="4" src={user.user.photoUrl} />
              <span class="ml-2 ">{user.user.username}</span>
            </div>
          {/each}
        </div>
      </Popover>
      <span
        id="reaction-{r.id}"
        on:click={() => {
          submit({ detail: r.emote });
        }}
        class="reaction text-xl px-2 text-center cursor-pointer rounded-lg shadow bg-gray-100 dark:bg-gray-900 mr-1"
        >{r.emote} <span class="text-sm text-center">{r.count}</span></span
      >
    {/each}
    <span class="text-xl px-2 text-center rounded-lg shadow bg-gray-100 dark:bg-gray-900"
      ><EmojiSelector class="z-50" on:emoji={submit} /></span
    >
  </div>
{/if}

<style>
</style>
