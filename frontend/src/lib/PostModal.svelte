<script lang="ts">
  import { Button, Label, Modal, Select, Textarea } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import type { PostDetails, PostListItem } from '../types';

  export let title = '';
  export let submit: ({ tags, name, content }: { tags: string[]; name: string; content: string }) => Promise<void>;
  export let post: PostListItem;

  onMount(() => {
    if (post) {
      let p = post as PostDetails;
      name = p.name;
      content = p.content;
      tags = p.tags.map(el => el.value);
      curr_tag = tags[1];
    }
  });

  let name = '';
  let content = '';
  let tags = [''];
  let curr_tag;
  let tag_selection = ['workshop', 'rfc', 'event', 'marketplace'].map(el => ({ name: el, value: el }));
</script>

<Modal size="lg" {title} open={true}>
  <Label for="select-lg"
    >Tags:
    <Select
      id="select-lg"
      class="mt-2"
      size="md"
      items={tag_selection}
      bind:value={curr_tag}
      on:change={() => (tags = [curr_tag])}
    />
  </Label>

  <Textarea class="name" bind:value={name} cols="35" rows="1" name="text" placeholder="What do you want to call it?" />
  <Textarea bind:value={content} name="text" class="overflow-y-scroll" placeholder="What is it exactly about?" />
  <Button
    class="submit"
    on:click={async () => {
      submit({
        content,
        name,
        tags
      });
    }}
  >
    Submit
  </Button>
</Modal>
