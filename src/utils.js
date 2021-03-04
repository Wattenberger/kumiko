import { format } from "d3-format";

export const move = (x, y, isAttr = false) =>
  `transform: translate(${x}${isAttr ? "" : "px"}, ${y}${isAttr ? "" : "px"})`;

export const getSpiralPositions = (
  n = 100,
  pointRadius = 5,
  angleDiff = 2,
  distance = 1.5
) => {
  let angle = 0;
  return new Array(n).fill(0).map((_, i) => {
    const radius = Math.sqrt(i + 0.3) * pointRadius * distance;
    angle += Math.asin(1 / radius) * pointRadius * angleDiff;
    angle = angle % (Math.PI * 2);
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      angle,
    };
  });
};

let runningId = 0;
export const getUniqueId = () => {
  runningId++;
  return runningId;
};

export const flatten = (arr) => arr.reduce((a, b) => [...a, ...b]);

export const getPointFromAngleAndDistance = (angle, distance) => ({
  x: Math.cos((angle * Math.PI) / 180) * distance,
  y: Math.sin((angle * Math.PI) / 180) * distance,
});

export const sum = (arr) => arr.reduce((a, b) => a + b, 0);

export const getDistanceFromXY = ([x, y]) =>
  Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

export const getNumberWithUnits = (d, numDecimals = 1) => {
  const siUnits = Math.floor((d / 10).toFixed(0).toString().length);
  return siUnits >= 15
    ? format(`.${numDecimals}f`)(d / 1000000000000000) + " quadrillion"
    : siUnits >= 12
    ? format(`.${numDecimals}f`)(d / 1000000000000) + " trillion"
    : siUnits >= 9
    ? format(`.${numDecimals}f`)(d / 1000000000) + " billion"
    : siUnits >= 6
    ? format(`.${numDecimals}f`)(d / 1000000) + " million"
    : siUnits >= 3
    ? format(`.${numDecimals}f`)(d / 1000) + " thousand"
    : d < 0.001
    ? 0
    : d < 0.1
    ? format(`,.2f`)(d)
    : format(`,.02f`)(d);
};

// grabbed from https://gist.github.com/callumlocke/cc258a193839691f60dd
export const scaleCanvas = (canvas, context, width, height) => {
  // assume the device pixel ratio is 1 if the browser doesn't specify it
  const devicePixelRatio = window.devicePixelRatio || 1;

  // determine the 'backing store ratio' of the canvas context
  const backingStoreRatio =
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;

  // determine the actual ratio we want to draw at
  const ratio = devicePixelRatio / backingStoreRatio;

  if (devicePixelRatio !== backingStoreRatio) {
    // set the 'real' canvas size to the higher width/height
    canvas.width = width * ratio;
    canvas.height = height * ratio;

    // ...then scale it back down with CSS
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
  } else {
    // this is a normal 1:1 device; just scale it simply
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = "";
    canvas.style.height = "";
  }

  // scale the drawing context so everything will work at the higher ratio
  context.scale(ratio, ratio);
};

// from https://davidwalsh.name/javascript-debounce-function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export const debounce = (func, wait, immediate) => {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const getDomainNameFromUrl = (url) => {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }

  //find & remove port number
  hostname = hostname.split(":")[0];
  hostname = hostname.replace("www.", "");
  //find & remove "?"
  hostname = hostname.split("?")[0];

  return hostname;
};

export const randomInRange = (min, max) => min + Math.random() * (max - min);
export const pickFrom = (arr) => arr[Math.round(randomInRange(0, arr.length))];

export const asyncLoadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "*";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = "anonymous";
    img.src = src;
  });

export const asyncLoadFile = (src) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (res) => resolve(res.target.result);
    reader.onerror = reject;
  });

export const distanceBetweenPoints = (pos1, pos2) =>
  Math.sqrt(
    Math.pow(Math.abs(pos2[1] - pos1[1]), 2) +
      Math.pow(Math.abs(pos2[0] - pos1[0]), 2)
  );

export const getRange = (n) => new Array(n).fill(0).map((_, i) => i);
