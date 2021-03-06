<script>
  import patterns from "./patterns";
  import { getRange } from "./../utils";

  export let isThinking = false;
  export let activePatterns;
  export let lineWidth = 0;
  export let triangles = [];

  let allPatterns = [];
  let activePatternNames = [8, 4, 11, 12, 7, 19, 20];

  const initialTriangleDimensions = [252, 290];
  const rawInitialTriangleDimensions = [289, 252];

  let patternDummyCanvasElement;
  const getPatternDarkness = patternString => {
    if (!patternDummyCanvasElement) return;

    const ctx = patternDummyCanvasElement.getContext("2d");

    ctx.clearRect(0, 0, ...rawInitialTriangleDimensions);
    const paths = (patternString.match(/(d\=\")(.+?)(?=\")/g) || []).map(d =>
      d.slice(3)
    );
    ctx.lineWidth = lineWidth;

    paths.forEach(path => {
      ctx.stroke(new Path2D(path));
    });

    const imageData = ctx.getImageData(0, 0, ...rawInitialTriangleDimensions);
    const numberOfPixels = Math.floor(imageData.data.length / 4);
    const numberOfPixelsFilled = getRange(numberOfPixels)
      .map(i => (imageData.data[i * 4 + 3] ? i : 0))
      .filter(d => d).length;
    const averageDarkness = numberOfPixelsFilled / numberOfPixels;
    return averageDarkness;
  };
  const getAllPatternDarknesses = () => {
    const rawPatternDarknesses = patterns
      .map((pattern, i) => ({ i, darkness: getPatternDarkness(pattern) }))
      .sort((a, b) => a["darkness"] - b["darkness"]);
    allPatterns = rawPatternDarknesses;
    console.log("activePatterns", activePatterns);
  };
  $: patternDummyCanvasElement, lineWidth, getAllPatternDarknesses();

  $: step = 1 / activePatternNames.length;
  $: activePatterns = allPatterns
    .filter(d => activePatternNames.includes(d.i))
    .map((pattern, i) => ({
      ...pattern,
      start: i * step,
      end: (i + 1) * step
    }));

  const onTogglePattern = i => {
    const isActive = activePatternNames.includes(i);
    if (isActive) {
      activePatternNames = activePatternNames.filter(d => d != i);
    } else {
      activePatternNames = [...activePatternNames, i];
    }
  };

  const getCounts = () => {
    let runningCounts = {};
    triangles.forEach(({ patternIndex }) => {
      if (!runningCounts[patternIndex]) runningCounts[patternIndex] = 0;
      runningCounts[patternIndex]++;
    });
    return runningCounts;
    // return Object.keys(runningCounts).map(i => runningCounts[i]);
  };
  let counts = {};
  $: triangles, (counts = getCounts());
</script>

<div class="patterns" class:is-thinking="{isThinking}">
  <div class="title">Patterns</div>
  <div class="list">
    {#each allPatterns as { i, darkness, start, end } (i)}
      <button
        class="pattern"
        class:inactive="{!activePatternNames.includes(i)}"
        on:click="{() => onTogglePattern(i)}">
        <!-- {(darkness + '').slice(0, 5)} -->
        <!-- <div>
        {(((activePatterns.find(d => d.i == i) || {}).start || '') + '').slice(0, 3)}
        - {(((activePatterns.find(d => d.i == i) || {}).end || '') + '').slice(0, 3)}
      </div> -->
        <svg
          viewBox="0 0 {initialTriangleDimensions[0]}
          {initialTriangleDimensions[1]}"
          style="stroke-width: {lineWidth}">
          {@html patterns[i]}
        </svg>
        {#if activePatternNames.includes(i)}
          <div class="count">{counts[i] || 0}</div>
        {/if}
      </button>
    {/each}
  </div>
</div>

<canvas
  class="dummy"
  bind:this="{patternDummyCanvasElement}"
  width="{rawInitialTriangleDimensions[0]}"
  height="{rawInitialTriangleDimensions[1]}"></canvas>

<style>
  .patterns {
    position: sticky;
    top: 8em;
    right: 0;
    width: 5em;
    height: min-content;
    z-index: 200;
  }
  .list {
    max-height: calc(100vh - 11em);
    overflow: auto;
  }
  .is-thinking {
    opacity: 0.3;
    pointer-events: none;
  }
  .pattern {
    position: relative;
    appearance: none;
    background: none;
    border: 1px solid transparent;
    box-shadow: none;
    width: 100%;
    padding: 0.5em 1em;
    border-radius: 0.3em;
    transition: opacity 0.3s ease-out;
    cursor: pointer;
    /* stroke-width: 9; */
  }
  .pattern:focus {
    border-color: var(--focus);
  }
  .pattern:hover {
    background: var(--off-white);
  }
  svg {
    margin-left: -0.2em;
    margin-bottom: -0.6em;
    fill: none;
    stroke: #371863;
    stroke: var(--accent-darker);
    stroke-linecap: round;
    stroke-linejoin: round;
    overflow: visible;
  }
  .dummy {
    position: absolute;
    left: -100vw;
  }
  .inactive svg {
    stroke: var(--gray-light);
  }
  .title {
    text-align: center;
    font-size: 0.9em;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
    margin-right: 0.5em;
  }

  .count {
    position: absolute;
    top: 0.5em;
    left: 0;
    min-width: 1.9em;
    padding: 0.38em 0.6em;
    background: var(--accent-dark);
    color: white;
    font-size: 0.6em;
    border-radius: 2em;
    font-feature-settings: "tnum", 1;
  }
</style>
