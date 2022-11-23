<script context="module" lang="ts">
  let onTop; //keeping track of which open modal is on top
  const modals = {}; //all modals get registered here for easy future access

  // 	returns an object for the modal specified by `id`, which contains the API functions (`open` and `close` )
  export function getModal(id = '') {
    return modals[id];
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte';

  let topDiv;
  let visible = false;
  let prevOnTop;
  let closeCallback;

  export let id = '';

  function keyPress(ev) {
    //only respond if the current modal is the top one
    if (ev.key == 'Escape' && onTop == topDiv) close(); //ESC
  }

  /**  API **/
  function open(callback) {
    closeCallback = callback;
    if (visible) return;
    prevOnTop = onTop;
    onTop = topDiv;
    window.addEventListener('keydown', keyPress);

    //this prevents scrolling of the main window on larger screens
    document.body.style.overflow = 'hidden';

    visible = true;
    //Move the modal in the DOM to be the last child of <BODY> so that it can be on top of everything
    document.body.appendChild(topDiv);
  }

  function close(retVal) {
    if (!visible) return;
    window.removeEventListener('keydown', keyPress);
    onTop = prevOnTop;
    if (onTop == null) document.body.style.overflow = '';
    visible = false;
    if (closeCallback) closeCallback(retVal);
  }

  //expose the API
  modals[id] = { open, close };

  onDestroy(() => {
    delete modals[id];
    window.removeEventListener('keydown', keyPress);
  });
</script>

<div id="topModal" class:visible bind:this={topDiv} on:click={() => close()}>
  <div id="modal" style="width: {id.startsWith('bigpost') ? '80%' : '40%'};" on:click|stopPropagation={() => {}}>
    <div id="modal-content">
      <slot />
    </div>
  </div>
</div>

<style>
  #topModal {
    visibility: hidden;
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #4448;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #modal {
    position: relative;
    border-radius: 6px;
    background: white;
    filter: drop-shadow(5px 5px 5px #555);
    padding: 1em;
  }
  .visible {
    visibility: visible !important;
  }
  #modal-content {
    display: flex;
    flex-flow: column wrap;
    justify-content: left;
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
    overflow: auto;
    align-items: flex-start;
  }
</style>
