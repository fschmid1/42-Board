<script lang="ts">
  import { Button } from 'flowbite-svelte';
  import { apiBaseEndpoint } from '../variables';
  import EmojiSelector from 'svelte-emoji-selector';

  export let id;
  export let reactions;

  const submit = async emote => {
    const res = await fetch(apiBaseEndpoint + 'reaction/comments', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        id,
        emote: emote.detail
      }),
      credentials: 'include'
    });
    reactions = await res.json();
  };
</script>

{#if reactions}
  <div class="flex absolute -top-2 right-0 justify-en ">
    {#each reactions as r}
      <span
        on:click={() => {
          submit({ detail: r.emote });
        }}
        class="reaction text-xl px-2 text-center cursor-pointer rounded-lg shadow bg-gray-900 mr-1"
        >{r.emote} <span class="text-sm text-center">{r.count}</span></span
      >
    {/each}
    <span class="reaction text-xl px-2 text-center rounded-lg shadow bg-gray-900"
      ><EmojiSelector class="z-50" on:emoji={submit} /></span
    >
  </div>
{/if}

<style>
</style>
