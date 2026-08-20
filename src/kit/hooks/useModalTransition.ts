import { useState, useEffect, useCallback } from 'react';

const EXIT_MS = 200;

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useModalTransition(onClose: () => void) {
  const [closing, setClosing] = useState(false);

  const requestClose = useCallback(() => {
    setClosing(true);
  }, []);

  useEffect(() => {
    if (!closing) return;
    if (prefersReducedMotion()) {
      onClose();
      setClosing(false);
      return;
    }
    const timer = setTimeout(() => {
      onClose();
      setClosing(false);
    }, EXIT_MS);
    return () => clearTimeout(timer);
  }, [closing, onClose]);

  const overlayClass = `modal-overlay${closing ? ' is-closing' : ''}`;
  const panelClass = `modal-panel${closing ? ' is-closing' : ''}`;

  return { closing, requestClose, overlayClass, panelClass };
}
