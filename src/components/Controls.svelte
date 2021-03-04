<script>
  import {
    asyncLoadFile,
    asyncLoadImage,
    distanceBetweenPoints
  } from "./../utils";

  export let image;
  export let droppedFiles;
  export let imageOpacity;
  export let triangleWidth;
  export let lineWidth;
  export let exportStr;
  export let contrast;
  export let brightness;

  const imgUrl = "/assets/obama.png";
  let customFiles = [];
  let customFileUrl = null;

  const updateCustomFileUrl = file => {
    if (!file) return;
    try {
      customFileUrl = customFiles ? URL.createObjectURL(file) : null;
      droppedFiles = null;
    } catch (e) {
      console.log("issue with uploading file", e);
    }
    getImage();
  };
  $: customFiles, updateCustomFileUrl(customFiles[0]);
  $: droppedFiles, updateCustomFileUrl(droppedFiles && droppedFiles[0]);

  const getImage = async () => {
    image = await asyncLoadImage(customFileUrl || imgUrl);
  };
  getImage();

  const onDownload = () => {
    console.log({ exportStr });
    const svgBlob = new Blob([exportStr], {
      type: "image/svg+xmlcharset=utf-8"
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "Kumiko_pattern.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
</script>

<div class="controls">
  <div class="file">

    <input
      type="file"
      placeholder="Upload image"
      bind:files="{customFiles}"
      accept="image/*" />
  </div>
  <div class="control">
    <div class="label">
      imageOpacity
      <div class="value">{imageOpacity}</div>
    </div>
    <input
      type="range"
      bind:value="{imageOpacity}"
      min="0"
      max="1"
      step="0.05" />
  </div>
  <div class="control">
    <div class="label">
      triangleWidth
      <div class="value">{triangleWidth}</div>
    </div>
    <input type="range" bind:value="{triangleWidth}" min="20" max="100" />
  </div>
  <div class="control">
    <div class="label">
      lineWidth
      <div class="value">{lineWidth}</div>
    </div>
    <input type="range" bind:value="{lineWidth}" min="1" max="30" />
  </div>
  <div class="control">
    <div class="label">
      contrast
      <div class="value">{contrast}</div>
    </div>
    <input type="range" bind:value="{contrast}" min="0" max="5" step="0.01" />
  </div>
  <div class="control">
    <div class="label">
      brightness
      <div class="value">{brightness}</div>
    </div>
    <input type="range" bind:value="{brightness}" min="0" max="2" step="0.01" />
  </div>
  <div class="control">
    <button on:click="{onDownload}">Download SVG</button>
  </div>
</div>

<style>
  .controls {
    padding: 1em;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .control {
    padding: 1em;
  }
  .label {
    margin-bottom: 0.6em;
    display: flex;
    justify-content: space-between;
  }
  .value {
    padding-left: 1em;
    font-family: var(--mono);
    font-feature-settings: "tnum", 1;
    text-align: right;
    width: 4em;
  }
  input {
    width: 100%;
  }
  [type="file"] {
    cursor: pointer;
  }
  [type="file"]::placeholder {
    color: var(--gray);
  }
  [type="file"]::-webkit-file-upload-button {
    visibility: hidden;
  }
  [type="file"]::before {
    content: "Pick or drop an image";
    display: inline-block;
    background: #fff;
    border: 1px solid var(--gray);
    border-radius: 3px;
    padding: 5px 8px;
    outline: none;
    white-space: nowrap;
    -webkit-user-select: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.8em;

    margin-right: -7.3em;
  }
  [type="file"]:hover::before {
    border-color: #000;
  }
  [type="file"]:active::before {
    background: -webkit-linear-gradient(top, var(--off-white), #fff);
  }
  input[type="range"] {
  }

  input[type="range"]::-webkit-slider-thumb {
    height: 1em;
    width: 1em;
    border-radius: 50%;
    background: var(--accent-dark);
    -webkit-appearance: none;
    margin-top: -0.2em;
  }
  input[type="range"]:focus::-webkit-slider-runnable-track {
    background: var(--background-ui);
  }
  input[type="range"]::-moz-range-track {
    width: 100%;
    height: 10px;
    -moz-transition: 0.2s;
    transition: 0.2s;
    background: var(--background-ui);
    border-radius: 4px;
  }
  input[type="range"]::-moz-range-thumb {
    box-shadow: 1px 1px 1px #000, 0 0 1px #0d0d0d;
    height: 1em;
    width: 1em;
    border-radius: 50%;
    background: var(--accent-dark);
  }
</style>
