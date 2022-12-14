<script lang="ts">
  import { Button, Label, Select, Textarea } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import type { PostDetails } from '../types';
  import { trpc } from '../variables';
  import { postStore } from '../stores';
  import { Link, useNavigate } from 'svelte-navigator';
  import MarkdownEditor from './MarkdownEditor.svelte';

  export let id = '';

  const navigate = useNavigate();

  let post: PostDetails;

  onMount(async () => {
    if (id !== '-1') {
      post = await trpc.post.getById.query({ id: Number(id) });
      name = post.name;
      content = post.content;
      tags = post.tags.map(el => el.value);
      curr_tag = tags.find(el => el == post.tags[0].value) || tags[0];
    }
  });

  async function submit() {
    if (id === '-1') {
      const newPost = await trpc.post.create.mutate({
        content,
        name,
        tags
      });
      $postStore = [...$postStore, newPost];
    } else {
      const newPost = await trpc.post.update.mutate({
        content,
        name,
        tags,
        id: post.id
      });
      post = { ...post, name: newPost.name, content: newPost.content, tags: newPost.tags };
      const index = $postStore.findIndex(el => el.id == post.id);
      $postStore[index] = post;
    }
    navigate('/posts');
  }

  let name = '';
  let content = '';
  let tags = [''];
  let curr_tag;
  let tag_selection = ['workshop', 'rfc', 'event', 'marketplace'].map(el => ({ name: el, value: el }));
</script>

<Label for="select-lg" class="mt-4"
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

<Textarea class="name my-2" bind:value={name} cols="35" rows="1" name="text" placeholder="What do you want to call it?" />
<MarkdownEditor
  classes="h-96"
  value={content}
  on:change={value => {
    content = value.detail.value;
  }}
/>
<div class="flex mt-4">
  <Button class="submit" on:click={submit}>Submit</Button>
  <Link to={post?.id ? `/posts/${post.id}` : '-1'}><Button color="alternative" class="ml-4">Cancel</Button></Link>
</div>
