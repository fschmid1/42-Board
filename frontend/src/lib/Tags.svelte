<script lang="ts">

export let tags = [];
</script>
  
<div class="tags">
	{#each tags as tag}
		<span class="tag">{tag}</span>
	{/each}
</div>
 
<style>
  .tags {
	display: flex;
	flex-flow: row wrap;
	justify-content: flex-end;
  }

  .tag {
	background-color: #eee;
	border-radius: 9px;
	padding: 0 2px 0 5px;
	margin: 0 0.2rem;
  }
  .tag::before {
	content: "#";
	font-size: 0.85rem;
  }
</style>
  