<script>
  import { fly } from "svelte/transition";
  import {
    debounce,
    flatten,
    getRange,
    randomInRange,
    scaleCanvas,
    sum
  } from "./../utils";
  import patterns from "./patterns";
  import PatternPicker from "./PatternPicker.svelte";

  export let image;
  export let imageOpacity = 1;
  export let triangleWidth = 0;
  export let lineWidth = 0;
  export let exportStr = "";
  export let contrast = 0;
  export let brightness = 0;
  export let zoomLevel = 2;

  $: filtersId = [brightness, contrast].join("--");

  let isThinking = false;

  $: triangleHalfHeight = Math.tan((30 / 180) * Math.PI) * triangleWidth;
  $: triangleHeight = triangleHalfHeight * 2;

  let canvasElement;
  let wrapperWidth = 700;
  let width = 700;
  let height = 700;
  let ctx;
  let isAdjustingWidth;
  let ratio = 1;
  let activePatterns = [];
  let patternDarknesses = [];

  let cachedImageWorker;

  const drawImage = () => {
    if (!canvasElement) return;
    if (!image) return;

    ctx = canvasElement.getContext("2d");
    height = Math.min(
      window.innerHeight * 1.3,
      wrapperWidth * (image.height / image.width)
    );
    width = height * (image.width / image.height);
    canvasElement.height = height;
    canvasElement.width = width;

    // isAdjustingWidth = true;
    // scaleCanvas(canvasElement, ctx, width, height);

    // setTimeout(() => {
    // scaleCanvas(canvasElement, ctx, width, height);
    // isAdjustingWidth = false;
    ctx.clearRect(0, 0, width, height);
    if (brightness || contrast) {
      ctx.filter = `brightness(${brightness}) contrast(${contrast})`;
    }
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);

    // if (cachedImageWorker) cachedImageWorker.terminate();

    // const worker = new Worker("/assets/worker-image.js");
    // cachedImageWorker = worker;

    // const isModified = brightness || contrast;

    // if (!isModified) return;

    // const localImageIteration = imageIteration;
    // const pixelArray = ctx.getImageData(0, 0, width, height).data;
    // let newImageData = ctx.createImageData(width, height);
    // newImageData.data.set(pixelArray);

    // worker.postMessage({ newImageData, contrast, brightness });

    // worker.onmessage = ({ data }) => {
    //   if (imageIteration != localImageIteration) return;
    //   ctx.putImageData(data["newImageData"], 0, 0);
    //   imageIteration++;
    // };

    // }, 300);
  };

  $: canvasElement, width, image, filtersId, drawImage();

  let canUseCachedTriangles = false;
  $: image, width, triangleWidth, filtersId, (canUseCachedTriangles = false);
  // 139px 172px
  // const initialTriangleDimensions = [288.07469031485573, 249.62765814495913];
  const initialTriangleDimensions = [255, 292];
  // const initialTriangleDimensions = [139 * 2, 172 * 2];
  const rawInitialTriangleDimensions = [289, 252];

  let triangles = [];
  let numberOfColumns = 0;
  let numberOfTrianglesHigh = 0;

  let dummyCanvasElement;
  const getStandardTrianglePixelIndices = (isInverted = false) => {
    if (!dummyCanvasElement) return [];

    const ctx = dummyCanvasElement.getContext("2d");
    // scaleCanvas(dummyCanvasElement, ctx, width, triangleHeight);

    ctx.clearRect(0, 0, width, triangleHeight);

    let x1 = 0;
    let x2 = triangleWidth;
    const y1 = 0;
    const y2 = triangleHalfHeight;
    const y3 = triangleHeight;
    let topLeftCorner = [x1, y1];
    if (isInverted) [x1, x2] = [x2, x1];

    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x1, y3);
    ctx.lineTo(x1, y1);
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, width, triangleHeight);
    const pixelIndices = getRange(Math.floor(imageData.data.length / 4))
      .map(i => (imageData.data[i * 4 + 3] ? i : 0))
      .filter(d => d);
    const numberOfPixelsPerTriangle = imageData.data.length / 4;
    return [pixelIndices, numberOfPixelsPerTriangle];
  };

  let triangleIndices = [];
  let invertedTriangleIndices = [];
  let numberOfPixelsPerTriangle = 0;
  const updateTriangleIndices = () => {
    if (isAdjustingWidth) return;
    const newIndices = getStandardTrianglePixelIndices();
    triangleIndices = newIndices[0];
    numberOfPixelsPerTriangle = newIndices[1];
    invertedTriangleIndices = getStandardTrianglePixelIndices(true)[0];
  };
  $: width, triangleWidth, isAdjustingWidth, updateTriangleIndices();

  let imageIteration = 0;
  let cachedImageIteration = 0;
  $: image, triangleWidth, imageIteration++;

  let cachedWorker;
  let isFinished = false;
  let hasNewPatterns = false;

  const getTriangles = () => {
    // if (isAdjustingWidth) return;
    if (!ctx) {
      triangles = [];
      return;
    }

    const imageData = ctx.getImageData(0, 0, width, height);
    const imagePixels = imageData.data;

    numberOfColumns = Math.floor(width / triangleWidth);
    numberOfTrianglesHigh = Math.floor(height / triangleHalfHeight) - 1;

    if (
      !isFinished &&
      hasNewPatterns &&
      imageIteration == cachedImageIteration
    ) {
      return;
    }
    hasNewPatterns = false;

    if (canUseCachedTriangles) {
      cachedWorker.postMessage({
        imageIteration,
        width,
        numberOfColumns,
        numberOfTrianglesHigh,
        numberOfPixelsPerTriangle,
        triangleHeight,
        triangleWidth,
        imagePixels,
        triangleIndices,
        invertedTriangleIndices,
        patternDarknesses: activePatterns,
        ratio,
        cachedTriangles: triangles
      });
    } else {
      if (cachedWorker) cachedWorker.terminate();

      isFinished = false;

      const worker = new Worker("/assets/worker.js");
      cachedWorker = worker;
      cachedImageIteration = imageIteration;
      triangles = [];

      worker.onmessage = ({ data }) => {
        triangles = data["triangles"];
        isThinking = false;

        isFinished = !!data["isFinished"];
        canUseCachedTriangles = !!data["isFinished"];
        if (data["isFinished"] && hasNewPatterns) {
          getTriangles();
        }
      };
      // Compute in worker
      worker.postMessage({
        imageIteration,
        width,
        numberOfColumns,
        numberOfTrianglesHigh,
        numberOfPixelsPerTriangle,
        triangleHeight,
        triangleWidth,
        imagePixels,
        triangleIndices,
        invertedTriangleIndices,
        patternDarknesses: activePatterns,
        ratio,
        cachedTriangles: null
      });
      isThinking = true;
    }
  };
  $: activePatterns, (hasNewPatterns = true);
  const debounceGetTriangles = debounce(getTriangles, 500);
  $: ctx,
    imageIteration,
    triangleWidth,
    activePatterns,
    filtersId,
    // isAdjustingWidth,
    debounceGetTriangles();

  const updateExportStr = () => {
    exportStr = [
      `<?xml version="1.0" encoding="UTF-8" standalone="no"?>`,
      `<svg
        xmlns="http://www.w3.org/2000/svg" version="1.1"
        viewBox="${[
          0,
          0,
          numberOfColumns * initialTriangleDimensions[0],
          numberOfTrianglesHigh * (initialTriangleDimensions[1] / 2)
        ].join(" ")}"
        width="${width}"
        height="${height}"
        fill="none"
        stroke="black"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="${lineWidth}">`,

      ...triangles.map(
        ({ indices, patternIndex, isInverted, rotation, scaleY, offset }, i) =>
          `<g transform="translate(${(indices[0] || 0) *
            initialTriangleDimensions[0] +
            offset[0]}, ${(indices[1] || 0) *
            (initialTriangleDimensions[1] / 2) +
            offset[1]}) scale(1 ${scaleY}) rotate(${rotation} 145 125)">
            ${patterns[patternIndex]}
          </g>`
      ),
      `</svg>`
    ].join("\n");
  };
  $: triangles, activePatterns, lineWidth, updateExportStr();
</script>

<div class="wrapper" class:is-thinking="{isThinking}">
  <div class="canvas-wrapper" bind:clientWidth="{wrapperWidth}">
    <div class="canvas zoom--{zoomLevel}">
      <canvas
        id="canvas-id"
        bind:this="{canvasElement}"
        style="opacity: {imageOpacity}"></canvas>
      <svg
        class="svg"
        viewBox="{[0, 0, numberOfColumns * initialTriangleDimensions[0], numberOfTrianglesHigh * (initialTriangleDimensions[1] / 2)].join(' ')}"
        {width}
        {height}
        style="stroke-width: {lineWidth}; transform: translate(-{triangleWidth * 0.3}px,
        -{triangleWidth * 0.3}px">
        {#each triangles as { indices, patternIndex, rotation, scaleY, offset }, i (i)}
          <g
            class="group"
            transform="translate({(indices[0] || 0) * initialTriangleDimensions[0] + offset[0]},
            {(indices[1] || 0) * (initialTriangleDimensions[1] / 2) + offset[1]})
            scale(1 {scaleY}) rotate({rotation} 145 125)"
            in:fly="{{ y: 10 }}">
            {@html patterns[patternIndex]}
          </g>
        {/each}
      </svg>
      <!--
      {#if isThinking}
        <div class="thinking" transition:fly="{{ y: 20 }}">
          Processing those pixels, hold tight!
        </div>
      {/if} -->

    </div>
  </div>
  <PatternPicker bind:activePatterns {lineWidth} {triangles} />

</div>

<canvas
  class="dummy"
  bind:this="{dummyCanvasElement}"
  {width}
  height="{triangleHeight}"></canvas>

<style>
  .wrapper {
    display: flex;
    transition: opacity 0.3s ease-out;
  }
  .canvas-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100% - 4em);
  }
  .canvas {
    position: relative;
    transform-origin: center top;
    transition: all 0.3s ease-out;
  }
  .canvas canvas {
    width: 100%;
  }
  .svg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    /* stroke-width: 9; */
  }
  svg {
    fill: none;
    stroke: #371863;
    stroke: var(--accent-darker);
    stroke-linecap: round;
    stroke-linejoin: round;
    overflow: visible;
    transform: all 0.3s ease-out;
  }
  .dummy {
    position: absolute;
    left: -100vw;
  }
  .zoom--0 {
    transform: scale(0.4);
  }
  .zoom--1 {
    transform: scale(0.7);
  }
  .zoom--3 {
    transform: scale(1.3);
  }
  /* .thinking {
    position: absolute;
    top: 1em;
    right: 1em;
    bottom: 1em;
    left: 1em;
    display: flex;
    justify-content: center;
    padding: 6em 3em;
    background: rgb(209, 219, 226, 0.9);
    text-align: center;
    pointer-events: none;
    font-size: 1.3em;
    font-weight: 400;
    font-style: italic;
    z-index: 100;
  }
  .group {
    } */
  /* transform-origin: 144.5px 255px;  */
</style>
