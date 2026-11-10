/**
 * Global API Base Configuration
 * In local development: uses VITE_API_URL (http://localhost:5000)
 * In production: automatically returns relative '' on klubnikabytes.com so
 * requests always match the current domain (whether visited via www.klubnikabytes.com or klubnikabytes.com),
 * completely eliminating CORS preflight mismatch errors.
 */
export const getApiBase = () => {
  if (typeof window !== 'undefined' && window.location) {
    const currentHost = window.location.hostname;
    if (currentHost.includes('klubnikabytes.com')) {
      return '';
    }
  }
  return (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
};

export const API_BASE = getApiBase();

export const apiUrl = (path = '') => {
  const base = getApiBase();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

export default API_BASE;
