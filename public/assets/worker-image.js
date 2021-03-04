onmessage = function (event) {
  const { newImageData, contrast, brightness } = event.data;

  if (contrast != 0) {
    const newPixels = updateContrast(contrast, newImageData.data);
    newImageData.data.set(newPixels);
  }

  if (brightness != 0) {
    const newPixels = updateBrightness(brightness, newImageData.data);
    newImageData.data.set(newPixels);
  }

  postMessage({ newImageData });
};

const updateContrast = (value, pixelArray) => {
  let newPixelArray = [...pixelArray];
  value = (parseFloat(value) || 0) + 1;

  for (let i = 0; i < newPixelArray.length; i += 4) {
    newPixelArray[i] = ((newPixelArray[i] / 255 - 0.5) * value + 0.5) * 255;
    newPixelArray[i + 1] =
      ((newPixelArray[i + 1] / 255 - 0.5) * value + 0.5) * 255;
    newPixelArray[i + 2] =
      ((newPixelArray[i + 2] / 255 - 0.5) * value + 0.5) * 255;
  }
  return newPixelArray;
};

const updateBrightness = (value, pixelArray) => {
  let newPixelArray = [...pixelArray];
  value = (parseFloat(value) || 0) + 1;

  for (let i = 0; i < newPixelArray.length; i += 4) {
    newPixelArray[i] += value;
    newPixelArray[i + 1] += value;
    newPixelArray[i + 2] += value;
  }
  return newPixelArray;
};
