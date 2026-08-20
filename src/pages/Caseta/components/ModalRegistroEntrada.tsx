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
import type { Cita, EstadoCita, RegistroEntrada } from '@/lib/types';

interface Props {
  cita: Cita;
  onClose: () => void;
}

export function ModalRegistroEntrada({ cita, onClose }: Props) {
  const [citas, setCitas] = useAtom(citasAtom);
  const [transiciones, setTransiciones] = useAtom(transicionesAtom);
  const usuarioActivo = useAtomValue(usuarioActivoAtom);
  const toast = useToast();
  const { requestClose, overlayClass, panelClass } = useModalTransition(onClose);

  const [operador, setOperador] = useState('');
  const [placas, setPlacas] = useState('');
  const [numeroCaja, setNumeroCaja] = useState('');
  const [sello, setSello] = useState('');
  const [confirmar, setConfirmar] = useState<'en_caseta' | 'en_descarga' | null>(null);

  const camposValidos = operador.trim() && placas.trim() && numeroCaja.trim() && sello.trim();

  function ejecutar(siguienteEstado: EstadoCita) {
    const ahora = new Date().toISOString();
    const nombre = usuarioActivo?.nombre ?? 'Sistema';

    const entrada: RegistroEntrada = {
      operador: operador.trim(), placas: placas.trim(),
      numeroCaja: numeroCaja.trim(), sello: sello.trim(), timestamp: ahora,
    };

    const citaActualizada: Cita = { ...cita, entrada, estado: siguienteEstado };
    setCitas(citas.map(c => c.id === cita.id ? citaActualizada : c));

    const nuevasTransiciones = [
      ...transiciones,
      { id: crypto.randomUUID(), citaId: cita.id, estado: 'en_caseta' as EstadoCita, usuarioNombre: nombre, timestamp: ahora },
      { id: crypto.randomUUID(), citaId: cita.id, estado: siguienteEstado, usuarioNombre: nombre, timestamp: ahora },
    ];
    setTransiciones(nuevasTransiciones);

    const desc = siguienteEstado === 'en_caseta' ? 'queda en caseta' : 'pasa directo a rampa';
    toast.success(`Entrada registrada: ${cita.folio}`, `El transporte ${desc}.`);
    setConfirmar(null);
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
            width: 480, maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          }}
        >
          <ModalHeader title={`Registro de entrada — ${cita.folio}`} accentColor="#DC0202" onClose={requestClose} />
          <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CampoTexto label="Operador" value={operador} onChange={e => setOperador(e.target.value)} />
            <CampoTexto label="Placas" value={placas} onChange={e => setPlacas(e.target.value)} />
            <CampoTexto label="Número de caja" value={numeroCaja} onChange={e => setNumeroCaja(e.target.value)} />
            <CampoTexto label="Sello" value={sello} onChange={e => setSello(e.target.value)} />
            <div className="flex justify-end" style={{ gap: 8, marginTop: 8 }}>
              <Boton variante="secundario" onClick={requestClose}>Cancelar</Boton>
              <Boton variante="secundario" disabled={!camposValidos} onClick={() => setConfirmar('en_caseta')}>
                Dejar en caseta
              </Boton>
              <Boton disabled={!camposValidos} onClick={() => setConfirmar('en_descarga')}>
                Pasa directo a rampa
              </Boton>
            </div>
          </div>
        </div>
      </div>

      {confirmar && (
        <ConfirmDialog
          title="Confirmar registro de entrada"
          message={confirmar === 'en_caseta'
            ? `Se registrará la entrada de ${cita.folio} y quedará en caseta.`
            : `Se registrará la entrada de ${cita.folio} y pasará directo a rampa.`}
          confirmLabel="Confirmar"
          onCancel={() => setConfirmar(null)}
          onConfirm={() => ejecutar(confirmar)}
        />
      )}
    </>
  );
}
