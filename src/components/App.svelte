<script>
  import Meta from "./Meta.svelte";
  import Header from "./pudding/Header.svelte";
  import Wrapper from "./Wrapper.svelte";
  import Footer from "./pudding/Footer.svelte";
</script>

<Meta />

<Header />

<div class="background">
  <img class="left" src="/assets/pattern.svg" alt="background pattern" />
  <img class="right" src="/assets/pattern.svg" alt="background pattern" />
</div>
<div class="intro">
  <p>
    Welcome! Kumiko is an ancient Japanese woodworking technique, which involves
    slotting together many tiny pieces into a lattice. Inspired by
    <a
      href="https://www.youtube.com/watch?v=-NuqwJz9RNE"
      target="_blank"
      rel="noopener">
      this video
    </a>
    , this tool is here to help generate kumiko patterns, based on any image.
  </p>
  <p>
    Import your own photo, play around with different patterns, and export the
    svg to use as you like! I'll be using it to lasercut a wall panel, and would
    love to see what you create! Tweet me at
    <a href="https://twitter.com/wattenberger" target="_blank" rel="noopener">
      @wattenberger
    </a>
    .
  </p>
</div>

<Wrapper />

<Footer />

<style>
  .intro {
    padding: 1em 3em;
    font-size: 1.2em;
    line-height: 1.6em;
  }
  .background {
    position: absolute;
    top: -2em;
    left: 0;
    right: 0;
    height: 40em;
    display: flex;
    justify-content: space-between;
    opacity: 0.5;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
  }
  .background img {
    height: 100%;
    width: auto;
    stroke: var(--accent-lighter);
  }
  .left {
    margin-left: -2em;
  }
  .right {
    margin-right: -2em;
    transform: scaleX(-1);
  }
</style>
