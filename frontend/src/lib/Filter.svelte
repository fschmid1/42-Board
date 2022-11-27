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


	<Select items={orderOptions} bind:value={selected}  on:change={() => filterStore.set({ search: $filterStore.search, filter: selected })} />

