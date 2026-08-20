import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { format } from 'date-fns';
import { citasAtom, transicionesAtom } from '@/lib/store';
import type { Cita, EstadoCita, TransicionEstado } from '@/lib/types';

const ESTADOS_PATIO: EstadoCita[] = ['en_caseta', 'en_descarga'];

function calcEsperaCasetaMin(cita: Cita, transiciones: TransicionEstado[]): number | null {
  const tsCaseta = transiciones.find(t => t.citaId === cita.id && t.estado === 'en_caseta')?.timestamp;
  const tsDescarga = transiciones.find(t => t.citaId === cita.id && t.estado === 'en_descarga')?.timestamp;
  if (!tsCaseta || !tsDescarga) return null;
  return Math.max(0, Math.round((new Date(tsDescarga).getTime() - new Date(tsCaseta).getTime()) / 60000));
}

export interface ActividadReciente {
  transicion: TransicionEstado;
  folio: string;
}

export function useTablero() {
  const citas = useAtomValue(citasAtom);
  const transiciones = useAtomValue(transicionesAtom);

  const hoyStr = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);

  const citasHoy = useMemo(
    () => citas.filter(c => c.fechaProgramada === hoyStr),
    [citas, hoyStr],
  );

  const enPatio = useMemo(
    () => citas.filter(c => ESTADOS_PATIO.includes(c.estado)),
    [citas],
  );

  const enCaseta = useMemo(
    () => citas.filter(c => c.estado === 'en_caseta'),
    [citas],
  );

  const esperaPromedio = useMemo(() => {
    const esperas = citasHoy
      .map(c => calcEsperaCasetaMin(c, transiciones))
      .filter((m): m is number => m !== null);
    if (esperas.length === 0) return 0;
    return Math.round(esperas.reduce((a, b) => a + b, 0) / esperas.length);
  }, [citasHoy, transiciones]);

  const actividadReciente = useMemo<ActividadReciente[]>(() => {
    const folioMap = new Map(citas.map(c => [c.id, c.folio]));
    return [...transiciones]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 6)
      .map(t => ({ transicion: t, folio: folioMap.get(t.citaId) ?? '—' }));
  }, [transiciones, citas]);

  return {
    citasHoy: citasHoy.length,
    enPatio,
    enCaseta: enCaseta.length,
    esperaPromedio,
    actividadReciente,
  };
}
