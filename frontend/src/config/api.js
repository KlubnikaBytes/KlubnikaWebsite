/**
 * Global API Base Configuration
 * In local development: defaults to '' (Vite proxy forwards /api to http://localhost:5000)
 * In production: uses VITE_API_URL if configured in deployment environment (e.g. Vercel / Railway),
 * or falls back to relative '' if frontend and backend share the domain.
 */
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export const apiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
};

export default API_BASE;

