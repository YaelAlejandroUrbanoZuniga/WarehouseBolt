import { useState, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useModalTransition } from '@/kit/hooks/useModalTransition';
import { ModalHeader } from '@/kit/componentes/ModalHeader/ModalHeader';
import { Tabs } from '@/kit/componentes/Tabs/Tabs';
import { zIndex } from '@/kit/tokens/layout';
import { ESTADO_UI } from '@/lib/ui-map';
import { transicionesAtom } from '@/lib/store';
import type { Cita, CitaEditInput } from '@/lib/types';
import { ResumenCita } from './ResumenCita';
import { LineaTiempo } from './LineaTiempo';

const TABS = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'historial', label: 'Historial' },
];

interface Props {
  cita: Cita | null;
  onClose: () => void;
  onEditarCita: (citaId: string, input: CitaEditInput) => void;
  onCancelarCita: (citaId: string) => void;
  onBorrarCita: (citaId: string) => void;
}

export function ModalDetalleCita({ cita, onClose, onEditarCita, onCancelarCita, onBorrarCita }: Props) {
  const { requestClose, overlayClass, panelClass } = useModalTransition(onClose);
  const [activeTab, setActiveTab] = useState('resumen');
  const allTransiciones = useAtomValue(transicionesAtom);

  const transicionesCita = useMemo(
    () => allTransiciones.filter(t => t.citaId === cita?.id),
    [allTransiciones, cita?.id],
  );

  if (!cita) return null;

  const accentColor = ESTADO_UI[cita.estado].color;

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
        style={{
          backgroundColor: '#FFFFFF', borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.20)', overflow: 'hidden',
          width: 680, maxHeight: '85vh', display: 'flex', flexDirection: 'column',
        }}
      >
        <ModalHeader
          title={`Cita ${cita.folio}`}
          accentColor={accentColor}
          onClose={requestClose}
        />
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab}>
          <div style={{ overflowY: 'auto', padding: '20px 32px 24px', flex: 1 }}>
            {activeTab === 'resumen' && (
              <ResumenCita
                cita={cita}
                transiciones={transicionesCita}
                onEditarCita={onEditarCita}
                onCancelarCita={onCancelarCita}
                onBorrarCita={onBorrarCita}
                onClose={requestClose}
              />
            )}
            {activeTab === 'historial' && (
              <LineaTiempo transiciones={transicionesCita} cita={cita} />
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
