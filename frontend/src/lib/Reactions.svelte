<script lang="ts">
  export let reactions;
</script>

{#if reactions}
  <div class="reactions">
    {#each reactions as r}
      <span class="reaction">{r.emote}</span>
    {/each}
  </div>
{/if}

<style>
  .reactions {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
  }

  .reaction {
    background-color: #eee;
    border-radius: 9px;
    padding: 0 2px;
    margin: 0 0.2rem;
  }
</style>
