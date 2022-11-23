<script lang="ts">
  export let tags;
  export let user;
</script>

<div class="tags">
  {#if user}
    <span class="user">{user}</span>
  {/if}
  {#if tags}
    {#each tags as tag}
      {#if tag != ''}
        <span class="tag">{tag.value}</span>
      {/if}
    {/each}
  {/if}
</div>

<style>
  .tags {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
  }

  .tag {
    background-color: #eee;
    height: 1.5rem;
    border-radius: 9px;
    padding: 0 2px 0 5px;
    margin: 0 0.2rem;
  }
  .tag::before {
    content: '#';
    font-size: 0.85rem;
  }
  .user {
    height: 1.5rem;
    padding: 0 2px 0 5px;
    margin: 0 0.2rem;
    font-size: 0.8rem;
  }
  .user::before {
    content: '@';
    font-size: 0.85em;
  }
</style>
