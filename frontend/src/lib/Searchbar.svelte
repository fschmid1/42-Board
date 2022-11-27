<script lang="ts">
  import { Button, Search } from 'flowbite-svelte';
  import { filterStore } from '../stores';

  const search = (text: string) => {
	filterStore.set({ filter: $filterStore.filter, search: text });
  }
</script>

<div class="flex gap-2 w-full md:w-1/2">
  <Search
    size="md"
	on:change={(event) => {
		search(event.target.value);
	}}
  />
  <Button class="hidden !p-2.5 md:block">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      /></svg
    >
  </Button>
</div>
