import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { format, addDays } from 'date-fns';
import { citasAtom, transicionesAtom, docksAtom } from '@/lib/store';
import type { Cita, EstadoCita, TransicionEstado } from '@/lib/types';
import { ESTADOS, FLUJO_PRINCIPAL } from '@/lib/constants';
import { ESTADO_UI } from '@/lib/ui-map';

export interface ActividadReciente {
  transicion: TransicionEstado;
  folio: string;
}

export interface ItemDescarga {
  cita: Cita;
  rampa: string;
  minutos: number;
}

export interface ItemProxima {
  cita: Cita;
  minutosFaltantes: number;
}

export interface ItemMovimiento {
  cita: Cita;
  minutosEnEstado: number;
}

export interface PanelAhora {
  enDescarga: ItemDescarga[];
  proximaCita: ItemProxima | null;
  movimientos: ItemMovimiento[];
}

function calcEsperaMin(cita: Cita, transiciones: TransicionEstado[]): number | null {
  const citaTrans = transiciones.filter(t => t.citaId === cita.id);
  const tsCaseta = citaTrans.find(t => t.estado === 'en_caseta')?.timestamp;
  const tsPlanta = citaTrans.find(t => t.estado === 'en_planta')?.timestamp;
  const tsDescarga = citaTrans.find(t => t.estado === 'en_descarga')?.timestamp;
  if (!tsDescarga) return null;
  const candidatos = [tsCaseta, tsPlanta].filter((v): v is string => v != null);
  if (candidatos.length === 0) return null;
  const inicio = candidatos.reduce((a, b) => (a < b ? a : b));
  return Math.max(0, Math.round((new Date(tsDescarga).getTime() - new Date(inicio).getTime()) / 60000));
}

const ORDEN_ESTADOS: EstadoCita[] = [...FLUJO_PRINCIPAL, 'cancelada'];

export function useHome(ahora: Date) {
  const citas = useAtomValue(citasAtom);
  const transiciones = useAtomValue(transicionesAtom);
  const docks = useAtomValue(docksAtom);

  const hoyStr = useMemo(() => format(ahora, 'yyyy-MM-dd'), [ahora]);

  return useMemo(() => {
    const citasHoyArr = citas.filter(c => c.fechaProgramada === hoyStr);

    const hace7Dias = new Date(ahora);
    hace7Dias.setDate(hace7Dias.getDate() - 6);
    const hace7DiasStr = format(hace7Dias, 'yyyy-MM-dd');
    const citasSemana = citas.filter(c => c.fechaProgramada >= hace7DiasStr && c.fechaProgramada <= hoyStr).length;

    const enPatio = citas.filter(c =>
      c.estado === 'en_caseta' || c.estado === 'en_planta' || c.estado === 'en_descarga' || c.estado === 'saliendo',
    );

    const completadasHoy = citas.filter(c => {
      if (c.estado !== 'completada') return false;
      return transiciones.some(
        t => t.citaId === c.id && t.estado === 'completada' && t.timestamp.startsWith(hoyStr),
      );
    }).length;

    const esperas = citasHoyArr
      .map(c => calcEsperaMin(c, transiciones))
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

    const enDescarga: ItemDescarga[] = citas
      .filter(c => c.estado === 'en_descarga')
      .map(c => {
        const tsDescarga = transiciones
          .filter(t => t.citaId === c.id && t.estado === 'en_descarga')
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]?.timestamp;
        const minutos = tsDescarga
          ? Math.max(0, Math.round((ahora.getTime() - new Date(tsDescarga).getTime()) / 60000))
          : 0;
        const rampa = c.dockId ? (docks.find(d => d.id === c.dockId)?.nombre ?? '—') : '—';
        return { cita: c, rampa, minutos };
      });

    const mananaStr = format(addDays(ahora, 1), 'yyyy-MM-dd');
    const programadasCercanas = citas
      .filter(c => c.estado === 'programada' && (c.fechaProgramada === hoyStr || c.fechaProgramada === mananaStr))
      .map(c => {
        const ventanaDate = new Date(`${c.fechaProgramada}T${c.ventanaInicio}:00`);
        const minutosFaltantes = Math.round((ventanaDate.getTime() - ahora.getTime()) / 60000);
        return { cita: c, minutosFaltantes };
      })
      .filter(item => item.minutosFaltantes > -120)
      .sort((a, b) => a.minutosFaltantes - b.minutosFaltantes);
    const proximaCita: ItemProxima | null = programadasCercanas[0] ?? null;

    const movimientos: ItemMovimiento[] = citas
      .filter(c => c.estado === 'en_caseta' || c.estado === 'saliendo')
      .map(c => {
        const tsEstado = transiciones
          .filter(t => t.citaId === c.id && t.estado === c.estado)
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]?.timestamp;
        const minutosEnEstado = tsEstado
          ? Math.max(0, Math.round((ahora.getTime() - new Date(tsEstado).getTime()) / 60000))
          : 0;
        return { cita: c, minutosEnEstado };
      })
      .sort((a, b) => b.minutosEnEstado - a.minutosEnEstado);

    const panelAhora: PanelAhora = { enDescarga, proximaCita, movimientos };

    return {
      citasHoy: citasHoyArr.length,
      citasSemana,
      enPatio,
      completadasHoy,
      esperaPromedioMin,
      citasPorEstado,
      totalCitas,
      actividadReciente,
      panelAhora,
    };
  }, [citas, transiciones, docks, hoyStr, ahora]);
}
