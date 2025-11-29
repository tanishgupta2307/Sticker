export const downloadImage = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const dataURItoBlob = (dataURI: string) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

export const shareImage = async (dataUrl: string, title: string, text: string) => {
  if (navigator.share) {
    try {
      const blob = dataURItoBlob(dataUrl);
      const file = new File([blob], 'sticker.png', { type: 'image/png' });
      
      const shareData: ShareData = {
        title: title,
        text: text,
        files: [file]
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return true;
      } else {
        throw new Error("Sharing files is not supported on this device/browser.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      return false;
    }
  } else {
    return false;
  }
};

/**
 * Removes the white background from an image using a flood-fill algorithm
 * starting from the corners. This preserves the white "die-cut" border of the sticker
 * while making the outer rectangular background transparent.
 */
export const removeBackground = async (imageSrc: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const { width, height } = canvas;

      // Tolerance for "white" (0-255). 
      // Higher = more aggressive removal of off-white pixels.
      const tolerance = 50; 
      const tr = 255, tg = 255, tb = 255; // Target Color: White

      // Visited array to keep track of processed pixels
      const visited = new Uint8Array(width * height);
      
      // Queue for Breadth-First Search (Flood Fill)
      // Start from 4 corners to ensure we catch the background even if corners are blocked slightly
      const queue: number[] = [
        0, 
        width - 1, 
        (height - 1) * width, 
        (height - 1) * width + width - 1
      ];

      // Mark initial seeds as visited
      for(const idx of queue) {
        if (idx < visited.length) visited[idx] = 1;
      }

      // Check if a pixel matches the target color (White)
      const isMatch = (idx: number) => {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        // We don't check alpha here because source is likely opaque
        return Math.abs(r - tr) < tolerance && 
               Math.abs(g - tg) < tolerance && 
               Math.abs(b - tb) < tolerance;
      };

      let head = 0;
      // Process queue
      while (head < queue.length) {
        const pixelIndex = queue[head++];
        const x = pixelIndex % width;
        const y = Math.floor(pixelIndex / width);
        const dataIdx = pixelIndex * 4;

        if (isMatch(dataIdx)) {
          // Set pixel to transparent
          data[dataIdx + 3] = 0;

          // Check neighbors
          const neighbors = [
            { nx: x - 1, ny: y },
            { nx: x + 1, ny: y },
            { nx: x, ny: y - 1 },
            { nx: x, ny: y + 1 }
          ];

          for (const { nx, ny } of neighbors) {
             if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
               const nPixelIndex = ny * width + nx;
               if (visited[nPixelIndex] === 0) {
                 visited[nPixelIndex] = 1; // Mark as visited
                 queue.push(nPixelIndex); // Add to queue
               }
             }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (e) => reject(e);
    img.src = imageSrc;
  });
};
