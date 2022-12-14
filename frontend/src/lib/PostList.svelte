<script lang="ts">
  import Post from '../lib/Post.svelte';

  import { postStore, filterStore, paginationStore } from '../stores';
  import { Skeleton, Card, Pagination } from 'flowbite-svelte';
  import { Route } from 'svelte-navigator';
  import Details from './Details.svelte';

  const previous = () => {
    const page = $filterStore.page;
    if (page == 1) return;
    filterStore.set({ ...$filterStore, page: page - 1 });
  };
  const next = () => {
    const page = $filterStore.page;
    if (1 + 12 * (page - 1) + $postStore.length - 1 >= $paginationStore.total) {
      return;
    }
    filterStore.set({ ...$filterStore, page: page + 1 });
  };
</script>

<div class="relative grid grid-cols-1 md:grid-cols-2 w-full lg:grid-cols-3 grid-flow-row gap-4">
  {#if $postStore.length == 0}
    {#each new Array(12) as d}
      <Card>
        <Skeleton />
      </Card>
    {/each}
  {/if}
  {#each $postStore as post}
    <Post {post} />
  {/each}
</div>

<div class="mt-2 mb-4 flex w-full justify-center">
  <div class="flex flex-col items-center justify-center">
    <div class="text-sm text-gray-700 dark:text-gray-400">
      Showing <span class="font-semibold text-gray-900 dark:text-white">{1 + 12 * ($filterStore.page - 1)}</span> to
      <span class="font-semibold text-gray-900 dark:text-white">{1 + 12 * ($filterStore.page - 1) + $postStore.length - 1}</span>
      of <span class="font-semibold text-gray-900 dark:text-white">{$paginationStore.total}</span> Entries
    </div>
    <Pagination table>
      <div slot="prev" class="flex items-center gap-2" on:click={previous}>
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
          ><path
            fill-rule="evenodd"
            d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          /></svg
        >
        Prev
      </div>
      <div slot="next" class="flex items-center gap-2" on:click={next}>
        Next
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
          ><path
            fill-rule="evenodd"
            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          /></svg
        >
      </div>
    </Pagination>
  </div>
</div>
><Route primary={false} path="/:id" component={Details} />
