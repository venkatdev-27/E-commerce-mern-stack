
/**
 * Helper to safely construct image URLs
 * Handles:
 * 1. Base64 data URIs (returns as is)
 * 2. Absolute URLs (returns as is)
 * 3. Relative paths (prepends backend URL)
 * 4. Windows backslashes (converts to forward slashes)
 * 5. Invalid localhost ports (fixes 5174 -> 5000 if needed)
 */
export const getImageUrl = (image) => {
  if (!image) return "";

  // 1. Check for Base64 Data URI (Return as is)
  if (image.startsWith("data:")) {
    return image;
  }

  // 2. Fix Windows Backslashes
  let finalImage = image.replace(/\\/g, "/");

  // 3. Handle Absolute HTTP/HTTPS URLs
  if (finalImage.startsWith("http")) {
    if (finalImage.startsWith("http://localhost:5174")) {
       return finalImage.replace("5174", "5000"); // Fix bad data if any
    }
    return finalImage;
  }

  // 4. Ensure leading slash for relative paths
  if (!finalImage.startsWith("/")) {
    finalImage = "/" + finalImage;
  }

  // 5. Prepend Backend URL
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${BASE_URL}${finalImage}`;
};
