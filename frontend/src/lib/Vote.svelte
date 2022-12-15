<script lang="ts">
  import { trpc } from '../variables';
  import Fa from 'svelte-fa';
  import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
  import { postStore } from '../stores';

  export let votes = 0;
  export let postId;
  export let className = '';

  const doVote = async (up: boolean) => {
    let index = $postStore.findIndex(el => el.id == postId);
    let { score } = await trpc.vote.post.mutate({
      id: postId,
      up
    });
    votes = score;
    $postStore[index] = { ...$postStore[index], voteScore: score };
  };

  const voteUp = () => doVote(true);
  const voteDown = () => doVote(false);
</script>

<div class="vote {className}">
  <button on:click={voteUp}> <Fa icon={faChevronUp} /> </button>
  <span>{votes}</span>
  <button on:click={voteDown}> <Fa icon={faChevronDown} /> </button>
</div>

<style>
  .vote {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  button {
    padding: 0;
    margin: 0;
  }
</style>
