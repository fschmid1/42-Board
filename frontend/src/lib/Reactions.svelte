<script>

export let reactions;
</script>

<div class="reactions">
	{#each reactions as r}
		<span class="reaction">{r.emote}</span>
	{/each}
</div>

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
  