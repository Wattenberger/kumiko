onmessage = function (event) {
  const {
    width,
    numberOfColumns,
    numberOfTrianglesHigh,
    numberOfPixelsPerTriangle,
    triangleHeight,
    triangleWidth,
    imagePixels,
    triangleIndices,
    invertedTriangleIndices,
    patternDarknesses,
    ratio,
    cachedTriangles,
  } = event.data;

  updateTriangles({
    cachedTriangles,
    width,
    numberOfColumns,
    numberOfTrianglesHigh,
    numberOfPixelsPerTriangle,
    triangleHeight,
    triangleWidth,
    imagePixels,
    triangleIndices,
    invertedTriangleIndices,
    patternDarknesses,
    ratio,
  });
};
const updateTriangles = ({
  cachedTriangles,
  width,
  numberOfColumns,
  numberOfTrianglesHigh,
  numberOfPixelsPerTriangle,
  triangleHeight,
  triangleWidth,
  imagePixels,
  triangleIndices,
  invertedTriangleIndices,
  patternDarknesses,
  ratio,
}) => {
  let triangles = [];

  const getClosestPatternIndex = (darkness) => {
    const bucket =
      patternDarknesses.find((d) => d.start <= darkness && d.end > darkness) ||
      {};
    return bucket.i || 0;
  };

  if (!cachedTriangles) {
    const numbersPerPixel = ratio * 4;
    const triangleHalfHeight = triangleHeight / 2;

    getRange(numberOfColumns).forEach((columnIndex) => {
      getRange(numberOfTrianglesHigh).forEach((triangleIndex) => {
        const isInverted = !!(columnIndex % 2);
        let offset = [0, 0];

        const rotations = [330, 150, 90, 30, 210, 270];

        const rotationIndex = ((triangleIndex % 6) + (isInverted ? 3 : 0)) % 6;
        const rotation = rotations[rotationIndex];

        if (rotation == 330) {
          offset = [-62, -33];
        } else if (rotation == 30) {
          offset = [65, -33];
        } else if (rotation == 90) {
          offset = [0, 5];
        } else if (rotation == 150) {
          offset = [65, 39];
        } else if (rotation == 210) {
          offset = [-63, 36];
        } else if (rotation == 270) {
          offset = [2, 2];
        }

        let x1 = columnIndex * triangleWidth;
        let x2 = (columnIndex + 1) * triangleWidth;
        const y1 = triangleIndex * triangleHalfHeight;
        // const y2 = (triangleIndex + 1) * triangleHalfHeight;
        // const y3 = (triangleIndex + 2) * triangleHalfHeight;
        let topLeftCorner = [x1, y1];
        if (isInverted) [x1, x2] = [x2, x1];
        // (i) * n + j

        const pixelIndexStart =
          Math.round(topLeftCorner[1]) * Math.round(width) +
          Math.round(topLeftCorner[0]);
        const pixelIndexEnd = pixelIndexStart + numberOfPixelsPerTriangle;

        const activePixelRange = imagePixels.slice(
          pixelIndexStart * numbersPerPixel,
          pixelIndexEnd * numbersPerPixel
        );
        const activePixels = getRange(numberOfPixelsPerTriangle).map((i) =>
          activePixelRange.slice(
            i * numbersPerPixel,
            i * numbersPerPixel + numbersPerPixel
          )
        );
        const indices = isInverted ? invertedTriangleIndices : triangleIndices;

        const activePixelDarknesses = indices.map((i) => {
          const [r, g, b, a] = activePixels[i] || [];
          return ((a / 255) * sum([r, g, b])) / 3;
        });
        const averageDarkness =
          1 - sum(activePixelDarknesses) / activePixelDarknesses.length / 255;
        let closestPatternIndex = getClosestPatternIndex(averageDarkness);
        if (averageDarkness == 1 || averageDarkness < 0.001) return;
        // if (columnIndex == 3 && triangleIndex == 10) debugger;

        triangles.push({
          // points: [
          //   [x1, y1],
          //   [x2, y2],
          //   [x1, y3],
          //   [x1, y1],
          // ],
          averageDarkness,
          topLeftCorner,
          isInverted,
          indices: [columnIndex, triangleIndex],
          patternIndex: closestPatternIndex,
          rotation,
          offset,
        });
        postMessage({ triangles });
      });
    });
  } else {
    triangles = cachedTriangles.map((triangle) => {
      const patternIndex = getClosestPatternIndex(triangle["averageDarkness"]);
      return { ...triangle, patternIndex };
    });
  }

  postMessage({ triangles, isFinished: true });
  cachedTriangles = triangles;
};

const getRange = (n) => new Array(n).fill(0).map((_, i) => i);

const flatten = (arr) => arr.reduce((a, b) => [...a, ...b]);

const sum = (arr) => arr.reduce((a, b) => a + b, 0);
