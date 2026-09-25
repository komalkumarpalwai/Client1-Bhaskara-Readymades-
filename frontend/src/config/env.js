const rawApiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
// Strip trailing /api or / from rawApiUrl to get backend origin
const backendOrigin = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

export const ENV = {
  API_BASE_URL: rawApiUrl,
  BACKEND_BASE_URL: backendOrigin || 'http://localhost:5000',
  IS_PRODUCTION: import.meta.env.PROD
};

/**
 * Returns full absolute URL for product image URLs (e.g. /api/products/image/...)
 * Automatically prepends the active backend API host (Render in production, localhost in dev).
 */
export const getProductImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${ENV.BACKEND_BASE_URL}${cleanPath}`;
};

