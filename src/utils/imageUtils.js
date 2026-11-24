/**
 * SkillBridge Image Utility Helpers
 * Provides client-side resizing, compression, and Base64 Data URL generation
 */

/**
 * Resizes an image file proportionally and converts it into a lightweight Base64 Data URL.
 * Ensures profile avatars load instantly, persist across refreshes, and store cleanly in MongoDB & localStorage.
 * 
 * @param {File} file - Image File object from file input
 * @param {number} maxWidth - Max width in pixels (default: 300)
 * @param {number} maxHeight - Max height in pixels (default: 300)
 * @param {number} quality - JPEG compression quality 0.0 - 1.0 (default: 0.88)
 * @returns {Promise<string>} Base64 Data URL string
 */
export const resizeImageToBase64 = (file, maxWidth = 300, maxHeight = 300, quality = 0.88) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided.'));
    }

    if (!file.type || !file.type.startsWith('image/')) {
      return reject(new Error('Please select a valid image file (JPG, PNG, WEBP).'));
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const rawDataUrl = e.target?.result;
      if (!rawDataUrl || typeof rawDataUrl !== 'string') {
        return reject(new Error('Failed to read image file.'));
      }

      // Create an offscreen image to measure and scale
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while bounding within maxWidth x maxHeight
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Draw into canvas
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          // If 2D context unavailable, fallback to raw data URL
          return resolve(rawDataUrl);
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Keep PNG transparency if original is PNG, otherwise use JPEG for optimal compression
        const outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        try {
          const compressedDataUrl = canvas.toDataURL(outputMime, quality);
          resolve(compressedDataUrl);
        } catch {
          resolve(rawDataUrl);
        }
      };

      img.onerror = () => {
        // Fallback to raw data URL if image decoding fails in offscreen object
        resolve(rawDataUrl);
      };

      img.src = rawDataUrl;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};
