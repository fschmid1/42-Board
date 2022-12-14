<script lang="ts">
  import { Editor } from 'bytemd';
  import gfm from '@bytemd/plugin-gfm';
  import breaks from '@bytemd/plugin-breaks';
  import frontmatter from '@bytemd/plugin-frontmatter';
  import gemoji from '@bytemd/plugin-gemoji';
  import highlight from '@bytemd/plugin-highlight';
  import math from '@bytemd/plugin-math';
  import mediumZoom from '@bytemd/plugin-medium-zoom';
  import mermaid from '@bytemd/plugin-mermaid';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let classes = '';

  export let value = '';
  let mode = 'split';

  const plugins = [gfm(), breaks(), frontmatter(), gemoji(), highlight(), math(), mediumZoom(), mermaid()];

  function handleChange(e) {
    value = e.detail.value;
    dispatch('change', { value });
  }
</script>

<Editor class={classes} {value} {mode} {plugins} on:change={handleChange} />
