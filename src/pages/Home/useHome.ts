import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { format } from 'date-fns';
import { citasAtom, transicionesAtom } from '@/lib/store';
import type { Cita, EstadoCita, TransicionEstado } from '@/lib/types';
import { ESTADOS, FLUJO_PRINCIPAL } from '@/lib/constants';
import { ESTADO_UI } from '@/lib/ui-map';

export interface ActividadReciente {
  transicion: TransicionEstado;
  folio: string;
}

function calcEsperaCasetaMin(cita: Cita, transiciones: TransicionEstado[]): number | null {
  const tsCaseta = transiciones.find(t => t.citaId === cita.id && t.estado === 'en_caseta')?.timestamp;
  const tsDescarga = transiciones.find(t => t.citaId === cita.id && t.estado === 'en_descarga')?.timestamp;
  if (!tsCaseta || !tsDescarga) return null;
  return Math.max(0, Math.round((new Date(tsDescarga).getTime() - new Date(tsCaseta).getTime()) / 60000));
}

const ORDEN_ESTADOS: EstadoCita[] = [...FLUJO_PRINCIPAL, 'cancelada'];

export function useHome() {
  const citas = useAtomValue(citasAtom);
  const transiciones = useAtomValue(transicionesAtom);

  const hoyStr = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);

  return useMemo(() => {
    const citasHoyArr = citas.filter(c => c.fechaProgramada === hoyStr);

    const ahora = new Date();
    const hace7Dias = new Date(ahora);
    hace7Dias.setDate(hace7Dias.getDate() - 6);
    const hace7DiasStr = format(hace7Dias, 'yyyy-MM-dd');
    const citasSemana = citas.filter(c => c.fechaProgramada >= hace7DiasStr && c.fechaProgramada <= hoyStr).length;

    const enPatio = citas.filter(c => c.estado === 'en_caseta' || c.estado === 'en_descarga');

    const completadasHoy = citas.filter(c => {
      if (c.estado !== 'completada') return false;
      return transiciones.some(
        t => t.citaId === c.id && t.estado === 'completada' && t.timestamp.startsWith(hoyStr),
      );
    }).length;

    const esperas = citasHoyArr
      .map(c => calcEsperaCasetaMin(c, transiciones))
      .filter((m): m is number => m !== null);
    const esperaPromedioMin = esperas.length === 0
      ? 0
      : Math.round(esperas.reduce((a, b) => a + b, 0) / esperas.length);

    const conteoPorEstado = new Map<EstadoCita, number>();
    for (const c of citas) {
      conteoPorEstado.set(c.estado, (conteoPorEstado.get(c.estado) ?? 0) + 1);
    }
    const citasPorEstado = ORDEN_ESTADOS.map(estado => ({
      estado,
      nombre: ESTADOS[estado].nombre,
      valor: conteoPorEstado.get(estado) ?? 0,
      color: ESTADO_UI[estado].color,
    }));

    const totalCitas = citas.length;

    const folioMap = new Map(citas.map(c => [c.id, c.folio]));
    const actividadReciente: ActividadReciente[] = [...transiciones]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8)
      .map(t => ({ transicion: t, folio: folioMap.get(t.citaId) ?? '—' }));

    return {
      citasHoy: citasHoyArr.length,
      citasSemana,
      enPatio,
      completadasHoy,
      esperaPromedioMin,
      citasPorEstado,
      totalCitas,
      actividadReciente,
    };
  }, [citas, transiciones, hoyStr]);
}
