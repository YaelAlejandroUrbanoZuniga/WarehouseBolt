import { useState, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { citasAtom, docksAtom, transicionesAtom, usuarioActivoAtom } from '@/lib/store';
import type { Cita, ResultadoAuditoria } from '@/lib/types';
import { Boton } from '@/kit/componentes/Boton/Boton';
import { Insignia } from '@/kit/componentes/Insignia/Insignia';
import { SelectCatalogo } from '@/kit/componentes/SelectCatalogo/SelectCatalogo';
import { ConfirmDialog } from '@/kit/componentes/ConfirmDialog/ConfirmDialog';
import { LoadingState } from '@/kit/componentes/LoadingState/LoadingState';
import { useToast } from '@/kit/componentes/Toast/Toast';
import { ColumnaEstado } from './components/ColumnaEstado';
import { ModalCerrarDescarga } from './components/ModalCerrarDescarga';

export default function AlmacenPage() {
  const [citas, setCitas] = useAtom(citasAtom);
  const [transiciones, setTransiciones] = useAtom(transicionesAtom);
  const docks = useAtomValue(docksAtom);
  const usuarioActivo = useAtomValue(usuarioActivoAtom);
  const toast = useToast();

  const [asignarCita, setAsignarCita] = useState<Cita | null>(null);
  const [dockLabel, setDockLabel] = useState('');
  const [confirmarAsignar, setConfirmarAsignar] = useState(false);
  const [cerrarCita, setCerrarCita] = useState<Cita | null>(null);
  const [cargando] = useState(false);

  const docksActivos = useMemo(() => docks.filter(d => d.activo), [docks]);
  const dockLabels = useMemo(() => docksActivos.map(d => d.nombre), [docksActivos]);
  const dockSeleccionado = useMemo(
    () => docksActivos.find(d => d.nombre === dockLabel)?.id ?? '',
    [docksActivos, dockLabel],
  );

  const enEspera = useMemo(() => citas.filter(c => c.estado === 'en_caseta'), [citas]);
  const enDescarga = useMemo(() => citas.filter(c => c.estado === 'en_descarga'), [citas]);
  const completadas = useMemo(() => citas.filter(c => c.estado === 'completada'), [citas]);

  function asignarRampa() {
    if (!asignarCita || !dockSeleccionado) return;
    const ahora = new Date().toISOString();
    const nombre = usuarioActivo?.nombre ?? 'Sistema';

    setCitas(citas.map(c => c.id === asignarCita.id
      ? { ...c, dockId: dockSeleccionado, estado: 'en_descarga' as const }
      : c,
    ));
    setTransiciones([...transiciones, {
      id: crypto.randomUUID(), citaId: asignarCita.id,
      estado: 'en_descarga', usuarioNombre: nombre, timestamp: ahora,
    }]);

    const dockNombre = dockLabel;
    toast.success(`Rampa asignada: ${asignarCita.folio}`, `Asignada a ${dockNombre}.`);
    setAsignarCita(null);
    setDockLabel('');
    setConfirmarAsignar(false);
  }

  function cerrarDescarga(resultado: ResultadoAuditoria) {
    if (!cerrarCita) return;
    const ahora = new Date().toISOString();
    const nombre = usuarioActivo?.nombre ?? 'Sistema';

    setCitas(citas.map(c => c.id === cerrarCita.id
      ? { ...c, estado: 'completada' as const, resultadoAuditoria: resultado }
      : c,
    ));
    setTransiciones([...transiciones, {
      id: crypto.randomUUID(), citaId: cerrarCita.id,
      estado: 'completada', usuarioNombre: nombre, timestamp: ahora, nota: resultado,
    }]);

    toast.success(`Descarga cerrada: ${cerrarCita.folio}`, `Resultado: ${resultado}.`);
    setCerrarCita(null);
  }

  function toggleDocumentacion(cita: Cita) {
    setCitas(citas.map(c => c.id === cita.id
      ? { ...c, documentacionRecibida: !c.documentacionRecibida }
      : c,
    ));
  }

  if (cargando) return <LoadingState mensaje="Cargando almacén..." />;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#000000', margin: 0 }}>Almacén</h1>
      </div>

      <div className="flex" style={{ gap: 20 }}>
        <ColumnaEstado titulo="En caseta" citas={enEspera} renderCita={cita => (
          <Boton onClick={() => { setAsignarCita(cita); setDockLabel(''); }}>
            Asignar rampa
          </Boton>
        )} />

        <ColumnaEstado titulo="En descarga" citas={enDescarga} renderCita={cita => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#000000' }}>
              <input
                type="checkbox"
                checked={!!cita.documentacionRecibida}
                onChange={() => toggleDocumentacion(cita)}
                style={{ accentColor: '#DC0202' }}
              />
              Documentación recibida
            </label>
            <p style={{ fontSize: 12, color: '#808285', margin: 0 }}>
              Pendiente de definir con almacén qué documentos aplican.
            </p>
            <Boton onClick={() => setCerrarCita(cita)}>Cerrar descarga</Boton>
          </div>
        )} />

        <ColumnaEstado titulo="Completada" citas={completadas} renderCita={cita => (
          <div>
            {cita.resultadoAuditoria && (
              <Insignia estado={cita.resultadoAuditoria === 'completo' ? 'active' : cita.resultadoAuditoria === 'incompleto' ? 'warning' : 'error'}>
                {cita.resultadoAuditoria === 'completo' ? 'Completo' : cita.resultadoAuditoria === 'incompleto' ? 'Incompleto' : 'Dañado'}
              </Insignia>
            )}
          </div>
        )} />
      </div>

      {asignarCita && !confirmarAsignar && (
        <div
          onClick={() => setAsignarCita(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 10001,
            backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{
            backgroundColor: '#FFFFFF', borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.20)', width: 400, padding: '28px 32px',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#000000', marginBottom: 16 }}>
              Asignar rampa — {asignarCita.folio}
            </div>
            <div style={{ marginBottom: 16 }}>
              <SelectCatalogo
                value={dockLabel}
                onChange={setDockLabel}
                options={dockLabels}
                placeholder="Seleccionar rampa"
              />
              {dockLabel && (
                <p style={{ fontSize: 12, color: '#808285', margin: '4px 0 0' }}>
                  {dockLabel}
                </p>
              )}
            </div>
            <div className="flex justify-end" style={{ gap: 8 }}>
              <Boton variante="secundario" onClick={() => setAsignarCita(null)}>Cancelar</Boton>
              <Boton disabled={!dockSeleccionado} onClick={() => setConfirmarAsignar(true)}>Asignar</Boton>
            </div>
          </div>
        </div>
      )}

      {confirmarAsignar && asignarCita && (
        <ConfirmDialog
          title="Confirmar asignación"
          message={`Se asignará ${dockLabel || 'la rampa'} a ${asignarCita.folio}.`}
          confirmLabel="Asignar rampa"
          onCancel={() => setConfirmarAsignar(false)}
          onConfirm={asignarRampa}
        />
      )}

      {cerrarCita && (
        <ModalCerrarDescarga
          cita={cerrarCita}
          onClose={() => setCerrarCita(null)}
          onConfirmar={cerrarDescarga}
        />
      )}
    </div>
  );
}
