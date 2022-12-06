<script lang="ts">
  export let tags;
  export let user;
</script>

<div class="flex flex-col-reverse justify-end items-end">
  {#if user}
    <span class="h-6 text-base font-mono user">{user}</span>
  {/if}
  {#if tags}
    {#each tags as tag}
      {#if tag.value != ''}
        <span class="tag text-sm h-5 mt-0.5 rounded bg-gray-100 dark:bg-gray-900 px-1 ml-2">{tag.value}</span>
      {/if}
    {/each}
  {/if}
</div>

<style>
  .tag::before {
    content: '#';
    font-size: 0.85rem;
  }
  .user::before {
    content: '@';
    font-size: 0.85em;
  }
</style>
