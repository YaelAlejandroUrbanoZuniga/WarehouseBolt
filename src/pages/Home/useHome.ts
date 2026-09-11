import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getInicioSemana, getDiasSemana } from '@/pages/Citas/utils';
import { citasAtom, transicionesAtom, docksAtom, usuariosAtom } from '@/lib/store';
import type { Cita, EstadoCita, TransicionEstado, Usuario } from '@/lib/types';
import { ESTADOS, FLUJO_PRINCIPAL, ROL_ETIQUETA } from '@/lib/constants';
import { ESTADO_UI } from '@/lib/ui-map';

export interface ActividadReciente {
  transicion: TransicionEstado;
  folio: string;
  rolEtiqueta: string;
}

export interface ItemSeguimiento {
  cita: Cita;
  minutosEnEstado: number;
}

export interface ItemSemana {
  cita: Cita;
  diaEtiqueta: string;
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

function minutosDesdeEstado(cita: Cita, transiciones: TransicionEstado[], ahora: Date): number {
  const ts = transiciones
    .filter(t => t.citaId === cita.id && t.estado === cita.estado)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]?.timestamp;
  if (!ts) return 0;
  return Math.max(0, Math.round((ahora.getTime() - new Date(ts).getTime()) / 60000));
}

const ORDEN_ESTADOS: EstadoCita[] = [...FLUJO_PRINCIPAL, 'cancelada'];

export function useHome(ahora: Date) {
  const citas = useAtomValue(citasAtom);
  const transiciones = useAtomValue(transicionesAtom);
  const docks = useAtomValue(docksAtom);
  const usuarios = useAtomValue(usuariosAtom);

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

    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);
    const inicioMesStr = format(inicioMes, 'yyyy-MM-dd');
    const finMesStr = format(finMes, 'yyyy-MM-dd');
    const citasDelMes = citas.filter(c =>
      c.fechaProgramada >= inicioMesStr && c.fechaProgramada <= finMesStr,
    );

    const conteoPorEstado = new Map<EstadoCita, number>();
    for (const c of citasDelMes) {
      conteoPorEstado.set(c.estado, (conteoPorEstado.get(c.estado) ?? 0) + 1);
    }
    const citasPorEstado = ORDEN_ESTADOS.map(estado => ({
      estado,
      nombre: ESTADOS[estado].nombre,
      valor: conteoPorEstado.get(estado) ?? 0,
      color: ESTADO_UI[estado].color,
    }));

    const totalCitas = citasDelMes.length;

    const folioMap = new Map(citas.map(c => [c.id, c.folio]));
    const usuarioRolMap = new Map<string, string>(
      usuarios.map((u: Usuario) => [u.nombre, ROL_ETIQUETA[u.rol]]),
    );
    const actividadReciente: ActividadReciente[] = [...transiciones]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8)
      .map(t => ({
        transicion: t,
        folio: folioMap.get(t.citaId) ?? '—',
        rolEtiqueta: usuarioRolMap.get(t.usuarioNombre) ?? t.usuarioNombre,
      }));

    const citasEnCasetaHoy: ItemSeguimiento[] = citas
      .filter(c => c.estado === 'en_caseta' && c.fechaProgramada === hoyStr)
      .map(c => ({ cita: c, minutosEnEstado: minutosDesdeEstado(c, transiciones, ahora) }))
      .sort((a, b) => b.minutosEnEstado - a.minutosEnEstado);

    const citasEnPatioHoy: ItemSeguimiento[] = citas
      .filter(c =>
        (c.estado === 'en_planta' || c.estado === 'en_descarga' || c.estado === 'saliendo') &&
        c.fechaProgramada === hoyStr,
      )
      .map(c => ({ cita: c, minutosEnEstado: minutosDesdeEstado(c, transiciones, ahora) }))
      .sort((a, b) => b.minutosEnEstado - a.minutosEnEstado);

    const inicioSemana = getInicioSemana(ahora);
    const diasSemana = getDiasSemana(inicioSemana);
    const fechasSemanaStr = diasSemana.map(d => format(d, 'yyyy-MM-dd'));
    const citasSemanaCalendario: ItemSemana[] = citas
      .filter(c => c.estado === 'programada' && fechasSemanaStr.includes(c.fechaProgramada))
      .sort((a, b) => a.fechaProgramada.localeCompare(b.fechaProgramada))
      .map(c => {
        const fecha = new Date(`${c.fechaProgramada}T12:00:00`);
        const dia = format(fecha, 'EEEE d', { locale: es });
        return { cita: c, diaEtiqueta: dia.charAt(0).toUpperCase() + dia.slice(1) };
      });

    return {
      citasHoy: citasHoyArr.length,
      citasSemana,
      enPatio,
      completadasHoy,
      esperaPromedioMin,
      citasPorEstado,
      totalCitas,
      actividadReciente,
      citasEnCasetaHoy,
      citasEnPatioHoy,
      citasSemanaCalendario,
    };
  }, [citas, transiciones, docks, usuarios, hoyStr, ahora]);
}
