import { useEffect } from 'react';

export function useEscape(activo: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!activo) return;
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onEscape();
      }
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [activo, onEscape]);
}
