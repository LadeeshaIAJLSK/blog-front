/**
 * Utility functions for handling images
 */

/**
 * Get the full image URL for a given image path
 * @param {string} imagePath - The image path from the database
 * @returns {string} - Full URL to the image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL (starts with http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Fallback to hardcoded localhost if environment variable is not set
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  // Normalize path separators to forward slashes
  const normalizedPath = imagePath.replace(/\\/g, '/');
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = normalizedPath.startsWith('/') 
    ? normalizedPath.substring(1) 
    : normalizedPath;
  
  return `${apiUrl}/${cleanPath}`;
};

/**
 * Handle image load errors by providing a fallback
 * @param {Event} event - The error event
 * @param {string} fallbackSrc - Optional fallback image URL
 */
export const handleImageError = (event, fallbackSrc = null) => {
  if (fallbackSrc) {
    event.target.src = fallbackSrc;
  } else {
    // Create a placeholder image
    event.target.src = `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="18" fill="#9ca3af">
          Image not found
        </text>
      </svg>
    `)}`;
  }
  
  console.warn('Image failed to load:', event.target.src);
};

/**
 * Check if an image URL is accessible
 * @param {string} url - The image URL to check
 * @returns {Promise<boolean>} - Promise that resolves to true if image is accessible
 */
export const isImageAccessible = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};