import { useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { citasAtom, transicionesAtom, usuarioActivoAtom } from '@/lib/store';
import { useModalTransition } from '@/kit/hooks/useModalTransition';
import { ModalHeader } from '@/kit/componentes/ModalHeader/ModalHeader';
import { CampoTexto } from '@/kit/componentes/CampoTexto/CampoTexto';
import { Boton } from '@/kit/componentes/Boton/Boton';
import { ConfirmDialog } from '@/kit/componentes/ConfirmDialog/ConfirmDialog';
import { useToast } from '@/kit/componentes/Toast/Toast';
import { zIndex } from '@/kit/tokens/layout';
import type { Cita, RegistroSalida } from '@/lib/types';

interface Props {
  cita: Cita;
  onClose: () => void;
}

export function ModalRegistroSalida({ cita, onClose }: Props) {
  const [citas, setCitas] = useAtom(citasAtom);
  const [transiciones, setTransiciones] = useAtom(transicionesAtom);
  const usuarioActivo = useAtomValue(usuarioActivoAtom);
  const toast = useToast();
  const { requestClose, overlayClass, panelClass } = useModalTransition(onClose);

  const [numeroCaja, setNumeroCaja] = useState('');
  const [sello, setSello] = useState('');
  const [confirmar, setConfirmar] = useState(false);

  const camposValidos = numeroCaja.trim() && sello.trim();

  function ejecutar() {
    const ahora = new Date().toISOString();
    const nombre = usuarioActivo?.nombre ?? 'Sistema';

    const salida: RegistroSalida = {
      numeroCaja: numeroCaja.trim(), sello: sello.trim(), timestamp: ahora,
    };

    const citaActualizada: Cita = { ...cita, salida, estado: 'completada' };
    setCitas(citas.map(c => c.id === cita.id ? citaActualizada : c));

    setTransiciones([
      ...transiciones,
      { id: crypto.randomUUID(), citaId: cita.id, estado: 'completada', usuarioNombre: nombre, timestamp: ahora },
    ]);

    toast.success(`Salida registrada: ${cita.folio}`, `El transporte de ${cita.empresa} ha salido.`);
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
            width: 420, maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          }}
        >
          <ModalHeader title={`Registro de salida — ${cita.folio}`} accentColor="#DC0202" onClose={requestClose} />
          <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CampoTexto label="Número de caja" value={numeroCaja} onChange={e => setNumeroCaja(e.target.value)} />
            <CampoTexto label="Sello" value={sello} onChange={e => setSello(e.target.value)} />
            <div className="flex justify-end" style={{ gap: 8, marginTop: 8 }}>
              <Boton variante="secundario" onClick={requestClose}>Cancelar</Boton>
              <Boton disabled={!camposValidos} onClick={() => setConfirmar(true)}>Registrar salida</Boton>
            </div>
          </div>
        </div>
      </div>

      {confirmar && (
        <ConfirmDialog
          title="Confirmar salida"
          message={`Se registrará la salida de ${cita.folio} (${cita.empresa}).`}
          confirmLabel="Confirmar salida"
          onCancel={() => setConfirmar(false)}
          onConfirm={ejecutar}
        />
      )}
    </>
  );
}
