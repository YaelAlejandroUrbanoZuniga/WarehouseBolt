import { useState, useMemo, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { useModalTransition } from '@/kit/hooks/useModalTransition';
import { ModalHeader } from '@/kit/componentes/ModalHeader/ModalHeader';
import { CampoTexto } from '@/kit/componentes/CampoTexto/CampoTexto';
import { SelectCatalogo } from '@/kit/componentes/SelectCatalogo/SelectCatalogo';
import { Boton } from '@/kit/componentes/Boton/Boton';
import { ConfirmDialog } from '@/kit/componentes/ConfirmDialog/ConfirmDialog';
import { useToast } from '@/kit/componentes/Toast/Toast';
import { zIndex } from '@/kit/tokens/layout';
import { colores } from '@/kit/tokens/colores';
import { proveedoresAtom, transportistasAtom } from '@/lib/store';
import { PLANTA_NOMBRE } from '@/lib/constants';
import type { CitaInput } from '@/lib/types';

interface Props {
  onClose: () => void;
  onGuardar: (input: CitaInput) => { ok: true } | { ok: false; motivo: string };
}

export function PanelCrearCita({ onClose, onGuardar }: Props) {
  const toast = useToast();
  const { requestClose, overlayClass, panelClass } = useModalTransition(onClose);
  const proveedores = useAtomValue(proveedoresAtom);
  const transportistas = useAtomValue(transportistasAtom);

  const proveedoresActivos = useMemo(
    () => proveedores.filter(p => p.activo),
    [proveedores],
  );
  const opcionesProveedor = useMemo(
    () => proveedoresActivos.map(p => p.nombre),
    [proveedoresActivos],
  );
  const opcionesTransporte = useMemo(
    () => transportistas.map(t => t.empresa),
    [transportistas],
  );

  const [proveedorNombre, setProveedorNombre] = useState('');
  const [transporteNombre, setTransporteNombre] = useState('');
  const [poNumero, setPoNumero] = useState('');
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState(PLANTA_NOMBRE);
  const [fechaProgramada, setFechaProgramada] = useState('');
  const [ventanaInicio, setVentanaInicio] = useState('');
  const [ventanaFin, setVentanaFin] = useState('');
  const [notas, setNotas] = useState('');
  const [confirmar, setConfirmar] = useState(false);
  const [errorConflicto, setErrorConflicto] = useState('');

  const origenEditado = useRef(false);
  const transporteEditado = useRef(false);

  function handleProveedorChange(nombre: string) {
    setProveedorNombre(nombre);
    const prov = proveedoresActivos.find(p => p.nombre === nombre);
    if (!prov) return;
    if (!origenEditado.current) {
      setOrigen(prov.origenPredeterminado);
    }
    if (!transporteEditado.current && !transporteNombre && prov.lineaTransporteHabitual) {
      setTransporteNombre(prov.lineaTransporteHabitual);
    }
  }

  const proveedorId = useMemo(
    () => proveedoresActivos.find(p => p.nombre === proveedorNombre)?.id ?? '',
    [proveedoresActivos, proveedorNombre],
  );
  const transportistaId = useMemo(
    () => transportistas.find(t => t.empresa === transporteNombre)?.id ?? '',
    [transportistas, transporteNombre],
  );

  const camposValidos = poNumero.trim() && origen.trim() && destino.trim() &&
    fechaProgramada && ventanaInicio && ventanaFin && proveedorNombre && transporteNombre;

  function handleConfirm() {
    const result = onGuardar({
      poNumero: poNumero.trim(), origen: origen.trim(), destino: destino.trim(),
      fechaProgramada, ventanaInicio, ventanaFin, notas: notas.trim() || undefined,
      proveedorId, transportistaId,
    });
    setConfirmar(false);
    if (!result.ok) {
      setErrorConflicto(result.motivo);
      return;
    }
    toast.success(
      'Cita creada',
      `Programada para el ${fechaProgramada} de ${ventanaInicio} a ${ventanaFin}`,
    );
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
            width: 560, maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          }}
        >
          <ModalHeader title="Nueva cita" accentColor="#DC0202" onClose={requestClose} />
          <div style={{ padding: '24px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="grid grid-cols-2" style={{ gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: colores.texto.formulario }}>Proveedor</label>
                <SelectCatalogo
                  value={proveedorNombre}
                  onChange={handleProveedorChange}
                  options={opcionesProveedor}
                  placeholder="Seleccionar proveedor"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: colores.texto.formulario }}>Línea de transporte</label>
                <SelectCatalogo
                  value={transporteNombre}
                  onChange={v => { setTransporteNombre(v); transporteEditado.current = true; }}
                  options={opcionesTransporte}
                  placeholder="Seleccionar línea"
                />
              </div>
            </div>
            <div className="grid grid-cols-2" style={{ gap: 16 }}>
              <CampoTexto label="Número de PO" value={poNumero} onChange={e => setPoNumero(e.target.value)} />
              <CampoTexto label="Fecha programada" type="date" value={fechaProgramada} onChange={e => setFechaProgramada(e.target.value)} />
            </div>
            <div className="grid grid-cols-2" style={{ gap: 16 }}>
              <CampoTexto label="Origen" value={origen} onChange={e => { setOrigen(e.target.value); origenEditado.current = true; }} />
              <CampoTexto label="Destino" value={destino} onChange={e => setDestino(e.target.value)} />
            </div>
            <div className="grid grid-cols-2" style={{ gap: 16 }}>
              <CampoTexto label="Ventana inicio" type="time" value={ventanaInicio} onChange={e => { setVentanaInicio(e.target.value); setErrorConflicto(''); }} />
              <CampoTexto label="Ventana fin" type="time" value={ventanaFin} onChange={e => { setVentanaFin(e.target.value); setErrorConflicto(''); }} />
            </div>
            {errorConflicto && (
              <p style={{ fontSize: 13, fontWeight: 600, color: colores.status.error, margin: 0 }}>
                {errorConflicto}
              </p>
            )}
            <CampoTexto label="Notas (opcional)" value={notas} onChange={e => setNotas(e.target.value)} />
            <div className="flex justify-end" style={{ gap: 8, marginTop: 8 }}>
              <Boton variante="secundario" onClick={requestClose}>Cancelar</Boton>
              <Boton disabled={!camposValidos} onClick={() => setConfirmar(true)}>Guardar cita</Boton>
            </div>
          </div>
        </div>
      </div>

      {confirmar && (
        <ConfirmDialog
          title="Confirmar nueva cita"
          message={`Se creará una cita programada para el ${fechaProgramada}.`}
          confirmLabel="Crear cita"
          onCancel={() => setConfirmar(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
