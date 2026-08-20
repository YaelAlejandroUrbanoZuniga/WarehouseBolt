import { useState, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { citasAtom, docksAtom, transicionesAtom, usuarioActivoAtom } from '@/lib/store';
import { useModalTransition } from '@/kit/hooks/useModalTransition';
import { ModalHeader } from '@/kit/componentes/ModalHeader/ModalHeader';
import { SelectCatalogo } from '@/kit/componentes/SelectCatalogo/SelectCatalogo';
import { Boton } from '@/kit/componentes/Boton/Boton';
import { ConfirmDialog } from '@/kit/componentes/ConfirmDialog/ConfirmDialog';
import { useToast } from '@/kit/componentes/Toast/Toast';
import { InfoRow } from '@/components/InfoRow';
import { zIndex } from '@/kit/tokens/layout';
import type { Cita } from '@/lib/types';

interface Props {
  cita: Cita;
  onClose: () => void;
}

export function ModalIniciarDescarga({ cita, onClose }: Props) {
  const [citas, setCitas] = useAtom(citasAtom);
  const [transiciones, setTransiciones] = useAtom(transicionesAtom);
  const docks = useAtomValue(docksAtom);
  const usuarioActivo = useAtomValue(usuarioActivoAtom);
  const toast = useToast();
  const { requestClose, overlayClass, panelClass } = useModalTransition(onClose);

  const [dockLabel, setDockLabel] = useState('');
  const [confirmar, setConfirmar] = useState(false);

  const docksActivos = useMemo(() => docks.filter(d => d.activo), [docks]);
  const dockLabels = useMemo(() => docksActivos.map(d => d.nombre), [docksActivos]);
  const dockSeleccionado = useMemo(
    () => docksActivos.find(d => d.nombre === dockLabel),
    [docksActivos, dockLabel],
  );

  function ejecutar() {
    if (!dockSeleccionado) return;
    const ahora = new Date().toISOString();
    const nombre = usuarioActivo?.nombre ?? 'Sistema';

    setCitas(citas.map(c => c.id === cita.id
      ? { ...c, dockId: dockSeleccionado.id, estado: 'en_descarga' as const }
      : c,
    ));
    setTransiciones([...transiciones, {
      id: crypto.randomUUID(), citaId: cita.id,
      estado: 'en_descarga', usuarioNombre: nombre, timestamp: ahora,
    }]);

    toast.success(`Descarga iniciada: ${cita.folio}`, `Rampa ${dockSeleccionado.nombre}.`);
    setConfirmar(false);
    requestClose();
  }

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
            width: 440, display: 'flex', flexDirection: 'column',
          }}
        >
          <ModalHeader title={`Iniciar descarga — ${cita.folio}`} accentColor="#DC0202" onClose={requestClose} />
          <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <InfoRow label="Empresa" value={cita.empresa} />
              <InfoRow label="Placas" value={cita.entrada?.placas ?? '—'} />
              <InfoRow label="Transportista" value={cita.entrada?.transportista ?? '—'} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#484848', display: 'block', marginBottom: 4 }}>
                Rampa
              </label>
              <SelectCatalogo
                value={dockLabel}
                onChange={setDockLabel}
                options={dockLabels}
                placeholder="Seleccionar rampa"
              />
            </div>
            <div className="flex justify-end" style={{ gap: 8, marginTop: 8 }}>
              <Boton variante="secundario" onClick={requestClose}>Cancelar</Boton>
              <Boton disabled={!dockSeleccionado} onClick={() => setConfirmar(true)}>
                Iniciar descarga
              </Boton>
            </div>
          </div>
        </div>
      </div>

      {confirmar && dockSeleccionado && (
        <ConfirmDialog
          title="Confirmar inicio de descarga"
          message={`Se asignará ${dockSeleccionado.nombre} a ${cita.folio} e iniciará la descarga.`}
          confirmLabel="Iniciar descarga"
          onCancel={() => setConfirmar(false)}
          onConfirm={ejecutar}
        />
      )}
    </>
  );
}
