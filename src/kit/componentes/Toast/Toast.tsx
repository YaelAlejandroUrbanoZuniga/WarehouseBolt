import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle, faTimesCircle, faExclamationTriangle, faInfoCircle, faTimes,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { HEADER_HEIGHT } from '@/kit/tokens/layout';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: number;
  tipo: ToastType;
  titulo: string;
  mensaje?: string;
  closing: boolean;
}

const EXIT_MS = 200;

const estilos: Record<ToastType, { color: string; icon: IconDefinition }> = {
  success: { color: '#6ABF4B', icon: faCheckCircle },
  error: { color: '#DC0202', icon: faTimesCircle },
  warning: { color: '#D4A017', icon: faExclamationTriangle },
  info: { color: '#02B3E1', icon: faInfoCircle },
};

const duraciones: Record<ToastType, number> = {
  success: 4000, info: 4000, warning: 6000, error: 6000,
};

interface ToastApi {
  success: (titulo: string, mensaje?: string) => void;
  validationError: (titulo: string, mensaje?: string) => void;
  systemError: (mensaje?: string) => void;
  info: (titulo: string, mensaje?: string) => void;
  warning: (titulo: string, mensaje?: string) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, closing: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, EXIT_MS);
  }, []);

  const add = useCallback((tipo: ToastType, titulo: string, mensaje?: string) => {
    const id = ++nextId.current;
    setToasts(prev => [...prev, { id, tipo, titulo, mensaje, closing: false }]);
    setTimeout(() => dismiss(id), duraciones[tipo]);
    return id;
  }, [dismiss]);

  const api: ToastApi = {
    success: (titulo, mensaje?) => add('success', titulo, mensaje),
    validationError: (titulo, mensaje?) => add('warning', titulo, mensaje),
    systemError: (mensaje?) => add('error', 'Problema técnico — no fue por tus datos', mensaje),
    info: (titulo, mensaje?) => add('info', titulo, mensaje),
    warning: (titulo, mensaje?) => add('warning', titulo, mensaje),
    dismiss,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div style={{
        position: 'fixed', top: HEADER_HEIGHT + 16, right: 24,
        zIndex: 10002, display: 'flex', flexDirection: 'column', gap: 10,
        pointerEvents: 'none', maxWidth: 380,
      }}>
        {[...toasts].reverse().map(t => (
          <ToastCard key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const { color, icon } = estilos[item.tipo];
  const [closeHover, setCloseHover] = useState(false);

  return (
    <div
      className={`toast-item${item.closing ? ' is-closing' : ''}`}
      role={item.tipo === 'error' || item.tipo === 'warning' ? 'alert' : 'status'}
      style={{
        pointerEvents: 'auto', display: 'flex', alignItems: 'flex-start', gap: 10,
        backgroundColor: '#FFFFFF', borderLeft: `4px solid ${color}`,
        borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.20)', padding: '12px 14px',
      }}
    >
      <FontAwesomeIcon icon={icon} style={{ fontSize: 16, color, flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#000000', margin: 0 }}>{item.titulo}</p>
        {item.mensaje && (
          <p style={{ fontSize: 12, color: '#808285', margin: '2px 0 0' }}>{item.mensaje}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        onMouseEnter={() => setCloseHover(true)}
        onMouseLeave={() => setCloseHover(false)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 4,
          lineHeight: 0, flexShrink: 0,
        }}
      >
        <FontAwesomeIcon icon={faTimes} style={{ fontSize: 12, color: closeHover ? '#000000' : '#808285' }} />
      </button>
    </div>
  );
}
