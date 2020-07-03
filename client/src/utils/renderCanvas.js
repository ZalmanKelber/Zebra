export const renderCanvas = (originalImage, elementId, userId) => {
  const img = new Image();
  img.onload = () => {
    const cvs = document.getElementById(elementId);
    cvs.width = img.width;
    cvs.height = img.height;
    cvs.addEventListener("click", () => {
      window.open("/profile/" + userId);
    });
    const ctx = cvs.getContext("2d");
    ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
    const pixelData = ctx.getImageData(0, 0, cvs.width, cvs.height);
    for (let i = 0; i < pixelData.data.length; i += 4) {
      const r = pixelData.data[i];
      const g = pixelData.data[i + 1];
      const b = pixelData.data[i + 2];
      const avg = (r + g + b) / 3;
      if (r > g && r > b) {
        pixelData.data[i + 1] = 0;
        pixelData.data[i + 2] = 0;
        pixelData.data[i + 3] = 207;
      }
      else {
        pixelData.data[i] = avg > 127 ? 255 : 0;
        pixelData.data[i + 1] = avg > 127 ? 255 : 0;
        pixelData.data[i + 2] = avg > 127 ? 255 : 0;
      }
    }
    ctx.putImageData(pixelData, 0, 0);

  }
  img.src = originalImage;
}
