<script lang="ts">
  import { Button, Modal } from 'flowbite-svelte';
  import { authLoginEndpoint } from '../variables';
</script>

<Modal permanent size="md" open>
  <div class="w-full flex justify-center h-full items-center py-24">
    <Button
      size="xl"
      gradient
      color="purpleToPink"
      on:click={() => {
        location.replace(authLoginEndpoint);
      }}>Login</Button
    >
  </div>
</Modal>
