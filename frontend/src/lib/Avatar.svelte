<script lang="ts">
  export let src;
  export let size;
  export let className = '';
</script>

<div class="avatar h-{size} w-{size} {className} " style="background-image: url({src});" />

<style>
  .avatar {
    box-sizing: border-box;
    background-size: cover !important;
    display: block;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    border-radius: 50%;
    margin: auto;
    transition: all 0.2 ease;
  }
</style>
