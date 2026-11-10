import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Disable automatic browser scroll restoration so SPA navigation is deterministic
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (hash) {
      const targetId = hash.replace('#', '');
      let attempts = 0;
      const maxAttempts = 30; // 30 x 40ms = 1200ms polling for lazy chunks

      const scrollToTarget = () => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return true;
        }
        return false;
      };

      // Try immediately
      if (!scrollToTarget()) {
        const interval = setInterval(() => {
          attempts += 1;
          if (scrollToTarget() || attempts >= maxAttempts) {
            clearInterval(interval);
          }
        }, 40);

        return () => clearInterval(interval);
      }
    } else {
      // Standard page navigation (no hash): Force scroll to very top across rendering phases
      const forceScrollTop = () => {
        try {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        } catch {
          window.scrollTo(0, 0);
        }
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      };

      // 1. Immediate instant reset
      forceScrollTop();

      // 2. Next animation frame
      requestAnimationFrame(forceScrollTop);

      // 3. Post-mount fallbacks after React Suspense lazy chunks resolve
      const t1 = setTimeout(forceScrollTop, 50);
      const t2 = setTimeout(forceScrollTop, 150);
      const t3 = setTimeout(forceScrollTop, 300);
      const t4 = setTimeout(forceScrollTop, 500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [pathname, hash]);

  return null;
}
