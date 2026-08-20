import { useState } from 'react';
import { useModalTransition } from '@/kit/hooks/useModalTransition';
import { ModalHeader } from '@/kit/componentes/ModalHeader/ModalHeader';
import { Boton } from '@/kit/componentes/Boton/Boton';
import { ConfirmDialog } from '@/kit/componentes/ConfirmDialog/ConfirmDialog';
import { zIndex } from '@/kit/tokens/layout';
import type { Cita, ResultadoAuditoria } from '@/lib/types';

interface Props {
  cita: Cita;
  onClose: () => void;
  onConfirmar: (resultado: ResultadoAuditoria) => void;
}

const OPCIONES: { value: ResultadoAuditoria; label: string }[] = [
  { value: 'completo', label: 'Completo' },
  { value: 'incompleto', label: 'Incompleto' },
  { value: 'danado', label: 'Dañado' },
];

export function ModalCerrarDescarga({ cita, onClose, onConfirmar }: Props) {
  const { requestClose, overlayClass, panelClass } = useModalTransition(onClose);
  const [resultado, setResultado] = useState<ResultadoAuditoria | null>(null);
  const [confirmar, setConfirmar] = useState(false);

  return (
    <>
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
          style={{
            backgroundColor: '#FFFFFF', borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.20)', overflow: 'hidden',
            width: 420, display: 'flex', flexDirection: 'column',
          }}
        >
          <ModalHeader title={`Cerrar descarga — ${cita.folio}`} accentColor="#DC0202" onClose={requestClose} />
          <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>Resultado de auditoría</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {OPCIONES.map(op => (
                <label
                  key={op.value}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#000000' }}
                >
                  <input
                    type="radio"
                    name="resultado"
                    checked={resultado === op.value}
                    onChange={() => setResultado(op.value)}
                    style={{ accentColor: '#DC0202' }}
                  />
                  {op.label}
                </label>
              ))}
            </div>
            <p style={{ fontSize: 12, color: '#808285', margin: '4px 0 0' }}>
              Pendiente de definir el procedimiento cuando el resultado no es Completo.
            </p>
            <div className="flex justify-end" style={{ gap: 8, marginTop: 8 }}>
              <Boton variante="secundario" onClick={requestClose}>Cancelar</Boton>
              <Boton disabled={!resultado} onClick={() => setConfirmar(true)}>Cerrar descarga</Boton>
            </div>
          </div>
        </div>
      </div>

      {confirmar && resultado && (
        <ConfirmDialog
          title="Confirmar cierre de descarga"
          message={`Se cerrará la descarga de ${cita.folio} con resultado: ${resultado}.`}
          confirmLabel="Confirmar"
          onCancel={() => setConfirmar(false)}
          onConfirm={() => { onConfirmar(resultado); }}
        />
      )}
    </>
  );
}
