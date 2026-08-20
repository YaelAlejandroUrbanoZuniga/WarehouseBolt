import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { citasAtom } from '@/lib/store';
import { ESTADOS } from '@/lib/constants';
import type { Cita, EstadoCita } from '@/lib/types';
import { TablaDatos } from '@/kit/componentes/TablaDatos/TablaDatos';
import { Boton } from '@/kit/componentes/Boton/Boton';
import { Insignia } from '@/kit/componentes/Insignia/Insignia';
import { EmptyState } from '@/kit/componentes/EmptyState/EmptyState';
import { LoadingState } from '@/kit/componentes/LoadingState/LoadingState';
import type { SortableValue } from '@/kit/hooks/useTableSort';
import { ModalRegistroEntrada } from './components/ModalRegistroEntrada';
import { ModalRegistroSalida } from './components/ModalRegistroSalida';

const ESTADOS_EN_PATIO: EstadoCita[] = ['en_caseta', 'en_descarga'];

function calcTiempoEnPatio(timestamp: string, ahora: Date): string {
  const diff = ahora.getTime() - new Date(timestamp).getTime();
  const totalMin = Math.max(0, Math.floor(diff / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m}m`;
}

export default function CasetaPage() {
  const citas = useAtomValue(citasAtom);
  const [ahora, setAhora] = useState(() => new Date());
  const [entradaCita, setEntradaCita] = useState<Cita | null>(null);
  const [salidaCita, setSalidaCita] = useState<Cita | null>(null);
  const [cargando] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setAhora(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const hoyStr = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);

  const esperadas = useMemo(
    () => citas.filter(c => c.estado === 'programada' && c.fechaProgramada === hoyStr),
    [citas, hoyStr],
  );

  const enPatio = useMemo(
    () => citas.filter(c => ESTADOS_EN_PATIO.includes(c.estado)),
    [citas],
  );

  const filasEsperadas = useMemo(() => esperadas.map(c => ({
    ...c, ventana: `${c.ventanaInicio} - ${c.ventanaFin}`,
  })), [esperadas]);

  const filasEnPatio = useMemo(() => enPatio.map(c => ({
    ...c,
    placas: c.entrada?.placas ?? '—',
    tiempoPatio: c.entrada ? calcTiempoEnPatio(c.entrada.timestamp, ahora) : '—',
  })), [enPatio, ahora]);

  const columnasEsperadas = useMemo(() => [
    { key: 'folio', label: 'Folio', sortable: true, width: '100px' },
    { key: 'poNumero', label: 'PO', sortable: true, width: '100px' },
    { key: 'empresa', label: 'Empresa', sortable: true, width: '1fr' },
    { key: 'ventana', label: 'Ventana', sortable: true, width: '140px' },
    {
      key: 'accion', label: 'Acción', sortable: false, width: '160px',
      render: (row: Record<string, unknown>) => (
        <Boton onClick={() => setEntradaCita(citas.find(c => c.id === row.id) ?? null)}>
          Registrar llegada
        </Boton>
      ),
    },
  ], [citas]);

  const columnasEnPatio = useMemo(() => [
    { key: 'folio', label: 'Folio', sortable: true, width: '100px' },
    { key: 'empresa', label: 'Empresa', sortable: true, width: '1fr' },
    { key: 'placas', label: 'Placas', sortable: true, width: '120px' },
    {
      key: 'estado', label: 'Estado', sortable: false, width: '160px',
      render: (row: Record<string, unknown>) => {
        const estado = row.estado as EstadoCita;
        const cfg = ESTADOS[estado];
        return <Insignia estado={cfg.insignia}>{cfg.nombre}</Insignia>;
      },
    },
    { key: 'tiempoPatio', label: 'Tiempo en patio', sortable: true, width: '130px' },
    {
      key: 'accion', label: 'Acción', sortable: false, width: '160px',
      render: (row: Record<string, unknown>) => {
        if (row.estado !== 'en_descarga') return null;
        return (
          <Boton onClick={() => setSalidaCita(citas.find(c => c.id === row.id) ?? null)}>
            Registrar salida
          </Boton>
        );
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
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#000000', margin: '0 0 12px' }}>
          Esperadas hoy
        </h2>
        {esperadas.length === 0 ? (
          <EmptyState
            icon={faDoorOpen}
            title="Sin citas esperadas"
            description="No hay transportes programados para hoy que no hayan llegado."
          />
        ) : (
          <TablaDatos
            columnas={columnasEsperadas}
            filas={filasEsperadas}
            getValorOrdenable={getValorOrdenable}
            mensajeVacio="Sin citas esperadas."
          />
        )}
      </div>

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
    </div>
  );
}
