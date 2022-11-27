<script lang="ts">
    import { Select } from 'flowbite-svelte';
  import { filterStore } from '../stores';

  export let selected = 'votes';
  let orderOptions = [
	{
		name: 'By Votes',
		value: 'votes'
	},
	{
		name: 'By Date',
		value: 'ts'
	}
	
  ]
</script>

<div class="w-1/2 flex items-center justify-end ">
	<Select class="w-2/3" items={orderOptions} bind:value={selected}  on:change={() => filterStore.set({ search: $filterStore.search, filter: selected })} />
</div>

