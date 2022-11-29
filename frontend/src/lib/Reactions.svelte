<script lang="ts">
  import { Button } from 'flowbite-svelte';
  import { apiBaseEndpoint } from '../variables';

  export let id;
  export let reactions;

  const submit = async () => {
    const res = await fetch(apiBaseEndpoint + 'reaction/comments', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        id,
        emote: '🥹'
      }),
      credentials: 'include'
    });
    reactions = await res.json();
  };
</script>

{#if reactions}
  <div class="flex absolute -top-2 px-2 right-0 justify-end rounded shadow bg-gray-900">
    {#each reactions as r}
      <span class="reaction w-8 text-xl text-center rounded ">{r.emote}</span>
    {/each}
  </div>
{/if}

<style>
</style>
