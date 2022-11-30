<script lang="ts">
  import { Input } from 'flowbite-svelte';
  import { filterStore } from '../stores';

  let text = '';

  let timer;

  const debounce = func => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func();
    }, 750);
  };

  const search = () => {
    filterStore.set({ ...$filterStore, search: text, page: 1 });
  };
</script>

<div class="flex gap-2 w-full md:w-1/2">
  <Input
    type="text"
    placeholder="Search"
    bind:value={text}
    on:keyup={() => {
      debounce(() => {
        search();
      });
    }}
  >
    <svg slot="left" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      /></svg
    >
  </Input>
</div>
