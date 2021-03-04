<script>
  import { fly } from "svelte/transition";

  import Controls from "./Controls.svelte";
  import Canvas from "./Canvas.svelte";

  let image = "";
  let triangleWidth = 60;
  let lineWidth = 13;
  let imageOpacity = 0.6;
  let contrast = 1;
  let brightness = 1;

  let isDropping = false;
  let droppedFiles = null;
  let exportStr = "";

  const onDrop = e => {
    e.preventDefault();
    const dt = e.dataTransfer;
    console.log(droppedFiles, dt, e);
    if (dt.files.length) {
      droppedFiles = dt.files;
    } else {
      const url = dt.getData("Text") || dt.getData("URL");
      if (!url) return;
      console.log(url);
      let img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        image = img;
      };
      img.src = url;
    }
    isDropping = false;
  };
</script>

<svelte:window
  on:dragenter="{() => (isDropping = true)}"
  on:dragover|preventDefault="{() => (isDropping = true)}"
  on:dragleave="{() => (isDropping = false)}"
  on:drop|preventDefault="{onDrop}" />

<div class="wrapper" class:is-dropping="{isDropping}">
  {#if isDropping}
    <div class="dropping" transition:fly="{{ y: 20 }}">Drop your image!</div>
  {/if}

  <Controls
    bind:image
    bind:imageOpacity
    bind:triangleWidth
    bind:lineWidth
    bind:droppedFiles
    bind:contrast
    bind:brightness
    {exportStr} />
  <Canvas
    {image}
    {imageOpacity}
    {triangleWidth}
    {lineWidth}
    {contrast}
    {brightness}
    bind:exportStr />
</div>

<style>
  .wrapper {
    position: relative;
  }
  .dropping {
    position: absolute;
    top: 4em;
    right: 2em;
    bottom: 2em;
    left: 2em;
    display: flex;
    justify-content: center;
    padding: 6em 3em;
    background: rgb(209, 219, 226, 0.9);
    text-align: center;
    pointer-events: none;
    font-size: 1.3em;
    font-weight: 400;
    font-style: italic;
    z-index: 500;
  }
</style>
