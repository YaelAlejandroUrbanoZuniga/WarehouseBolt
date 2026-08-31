import { useState, type ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useModalTransition } from '@/kit/hooks/useModalTransition';
import { ModalHeader } from '@/kit/componentes/ModalHeader/ModalHeader';
import { zIndex } from '@/kit/tokens/layout';

interface Props {
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: string;
  confirmDisabled?: boolean;
  children?: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar',
  confirmColor = '#DC0202', confirmDisabled, children, onCancel, onConfirm,
}: Props) {
  const { requestClose, overlayClass, panelClass } = useModalTransition(onCancel);
  const [cancelHover, setCancelHover] = useState(false);
  const [confirmHover, setConfirmHover] = useState(false);

  return (
    <div
      onClick={requestClose}
      className={overlayClass}
      style={{
        position: 'fixed', inset: 0, zIndex: zIndex.modal,
        backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={panelClass}
        role="dialog"
        aria-modal="true"
        style={{
          backgroundColor: '#FFFFFF', borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.20)', overflow: 'hidden', width: 420,
        }}
      >
        <ModalHeader title={title} accentColor={confirmColor} onClose={requestClose} />
        <div style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, margin: '0 0 20px' }}>
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              style={{ fontSize: 18, color: confirmColor, flexShrink: 0, marginTop: 2 }}
            />
            <div style={{ fontSize: 13, color: '#808285', lineHeight: 1.6 }}>{message}</div>
          </div>
          {children}
          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: 8,
            marginTop: children ? 20 : 0,
          }}>
            <button
              onClick={requestClose}
              onMouseEnter={() => setCancelHover(true)}
              onMouseLeave={() => setCancelHover(false)}
              style={{
                padding: '8px 16px', fontSize: 13, fontWeight: 600,
                border: '1px solid #D1D3D4', borderRadius: 6,
                backgroundColor: cancelHover ? '#F5F5F5' : '#FFFFFF',
                color: '#000000', cursor: 'pointer',
              }}
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={confirmDisabled}
              onMouseEnter={() => setConfirmHover(true)}
              onMouseLeave={() => setConfirmHover(false)}
              style={{
                padding: '8px 16px', fontSize: 13, fontWeight: 700,
                border: 'none', borderRadius: 6,
                backgroundColor: confirmColor, color: '#FFFFFF',
                opacity: confirmDisabled ? 0.45 : 1,
                cursor: confirmDisabled ? 'not-allowed' : 'pointer',
                boxShadow: confirmHover && !confirmDisabled ? '0 4px 12px rgba(0,0,0,0.18)' : 'none',
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
