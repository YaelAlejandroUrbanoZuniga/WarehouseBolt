import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { citasAtom, transicionesAtom, usuarioActivoAtom } from '@/lib/store';
import type { Cita, EstadoCita } from '@/lib/types';
import { TablaDatos } from '@/kit/componentes/TablaDatos/TablaDatos';
import { Boton } from '@/kit/componentes/Boton/Boton';
import { InsigniaEstado } from '@/components/InsigniaEstado';
import { PanelEscaneo } from '@/components/PanelEscaneo';
import { EmptyState } from '@/kit/componentes/EmptyState/EmptyState';
import { LoadingState } from '@/kit/componentes/LoadingState/LoadingState';
import { ConfirmDialog } from '@/kit/componentes/ConfirmDialog/ConfirmDialog';
import { useToast } from '@/kit/componentes/Toast/Toast';
import type { SortableValue } from '@/kit/hooks/useTableSort';
import { ModalRegistroEntrada } from './components/ModalRegistroEntrada';
import { ModalRegistroSalida } from './components/ModalRegistroSalida';
import { PanelOcupacion } from './components/PanelOcupacion';
import { formatearDuracion } from '@/lib/tiempo';

const ESTADOS_EN_PATIO: EstadoCita[] = ['en_caseta', 'en_planta', 'en_descarga', 'saliendo'];

export default function CasetaPage() {
  const [citas, setCitas] = useAtom(citasAtom);
  const [transiciones, setTransiciones] = useAtom(transicionesAtom);
  const usuarioActivo = useAtomValue(usuarioActivoAtom);
  const toast = useToast();
  const [ahora, setAhora] = useState(() => new Date());
  const [entradaCita, setEntradaCita] = useState<Cita | null>(null);
  const [salidaCita, setSalidaCita] = useState<Cita | null>(null);
  const [confirmarAcceso, setConfirmarAcceso] = useState<Cita | null>(null);
  const [cargando] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setAhora(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const enPatio = useMemo(
    () => citas.filter(c => ESTADOS_EN_PATIO.includes(c.estado)),
    [citas],
  );

  const filasEnPatio = useMemo(() => enPatio.map(c => ({
    ...c,
    placas: c.entrada?.placas ?? '—',
    tiempoPatio: c.entrada ? formatearDuracion(c.entrada.timestamp, ahora) : '—',
  })), [enPatio, ahora]);

  function darAccesoPlanta(cita: Cita) {
    const ahoraISO = new Date().toISOString();
    const nombre = usuarioActivo?.nombre ?? 'Sistema';
    setCitas(citas.map(c => c.id === cita.id ? { ...c, estado: 'en_planta' as EstadoCita } : c));
    setTransiciones([
      ...transiciones,
      { id: crypto.randomUUID(), citaId: cita.id, estado: 'en_planta' as EstadoCita, usuarioNombre: nombre, timestamp: ahoraISO },
    ]);
    toast.success(`Acceso autorizado: ${cita.folio}`);
    setConfirmarAcceso(null);
  }

  const columnasEnPatio = useMemo(() => [
    { key: 'folio', label: 'Folio', sortable: true, width: '100px' },
    { key: 'empresa', label: 'Empresa', sortable: true, width: '1fr' },
    { key: 'placas', label: 'Placas', sortable: true, width: '120px' },
    {
      key: 'estado', label: 'Estado', sortable: false, width: '160px',
      render: (row: Record<string, unknown>) => {
        const estado = row.estado as EstadoCita;
        return <InsigniaEstado estado={estado} />;
      },
    },
    { key: 'tiempoPatio', label: 'Tiempo en patio', sortable: true, width: '130px' },
    {
      key: 'accion', label: 'Acción', sortable: false, width: '180px',
      render: (row: Record<string, unknown>) => {
        if (row.estado === 'en_caseta') {
          return (
            <Boton onClick={() => setConfirmarAcceso(citas.find(c => c.id === row.id) ?? null)}>
              Dar acceso a planta
            </Boton>
          );
        }
        if (row.estado === 'saliendo') {
          return (
            <Boton onClick={() => setSalidaCita(citas.find(c => c.id === row.id) ?? null)}>
              Registrar salida
            </Boton>
          );
        }
        return null;
      },
    },
  ], [citas]);

  const getValorOrdenable = useCallback(
    (row: Record<string, unknown>, field: string): SortableValue => {
      const v = row[field];
      if (typeof v === 'string' || typeof v === 'number') return v;
      if (v === null || v === undefined) return null;
      return String(v);
    }, [],
  );

  if (cargando) return <LoadingState mensaje="Cargando datos de caseta..." />;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <PanelEscaneo
          titulo="Registrar llegada"
          estadosValidos={['programada']}
          onCitaEncontrada={cita => setEntradaCita(cita)}
        />
      </div>

      <PanelOcupacion ahora={ahora} />

      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#000000', margin: '0 0 12px' }}>
          En patio
        </h2>
        {enPatio.length === 0 ? (
          <EmptyState
            icon={faDoorOpen}
            title="Patio vacío"
            description="No hay transportes en el patio en este momento."
          />
        ) : (
          <TablaDatos
            columnas={columnasEnPatio}
            filas={filasEnPatio}
            getValorOrdenable={getValorOrdenable}
            mensajeVacio="Sin transportes en patio."
          />
        )}
      </div>

      {entradaCita && (
        <ModalRegistroEntrada cita={entradaCita} onClose={() => setEntradaCita(null)} />
      )}
      {salidaCita && (
        <ModalRegistroSalida cita={salidaCita} onClose={() => setSalidaCita(null)} />
      )}
      {confirmarAcceso && (
        <ConfirmDialog
          title="Dar acceso a planta"
          message={`¿Autorizar el paso de ${confirmarAcceso.folio} (${confirmarAcceso.empresa}) a planta?`}
          confirmLabel="Autorizar acceso"
          onCancel={() => setConfirmarAcceso(null)}
          onConfirm={() => darAccesoPlanta(confirmarAcceso)}
        />
      )}
    </div>
  );
}
