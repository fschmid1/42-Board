<script lang="ts">
export let votes = 0;
const dec = () => {
    votes -= 1
  }
const inc = () => {
    votes += 1
  }
</script>
  
<div class="vote">
	<button on:click={inc}>
		∧
	</button>
	<span>{votes}</span>
	<button on:click={dec}>
		∨
	</button>
</div>
 
<style>
  .vote {
	display: flex;
	flex-direction: column;
	align-items: center;
  }

  button {
	padding: 0;
  }
</style>
