import { format } from 'date-fns';
import { colores } from '@/kit/tokens/colores';
import { MINUTOS_RETRASO } from '@/lib/constants';
import type { Cita, TransicionEstado } from '@/lib/types';

export function generarFolio(citasExistentes: Cita[]): string {
  const fechaHoy = format(new Date(), 'yyyyMMdd');
  const prefijo = `DF-${fechaHoy}-`;
  const consecutivo = citasExistentes.filter(c => c.folio.startsWith(prefijo)).length + 1;
  return `${prefijo}${String(consecutivo).padStart(3, '0')}`;
}

export function getInicioSemana(fecha: Date): Date {
  const d = new Date(fecha);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getDiasSemana(inicioSemana: Date): Date[] {
  const dias: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(inicioSemana);
    d.setDate(d.getDate() + i);
    dias.push(d);
  }
  return dias;
}

export function franjaIndex(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 2 + (m >= 30 ? 1 : 0);
}

export function hayTraslape(
  ventanaInicioA: string, ventanaFinA: string,
  ventanaInicioB: string, ventanaFinB: string,
): boolean {
  return ventanaInicioA < ventanaFinB && ventanaInicioB < ventanaFinA;
}

export function getFranjasMediaHora(): string[] {
  const franjas: string[] = [];
  for (let h = 0; h < 24; h++) {
    franjas.push(`${String(h).padStart(2, '0')}:00`);
    franjas.push(`${String(h).padStart(2, '0')}:30`);
  }
  return franjas;
}

export function addSemanas(fecha: Date, n: number): Date {
  const d = new Date(fecha);
  d.setDate(d.getDate() + n * 7);
  return d;
}


export type Puntualidad = 'a_tiempo' | 'antes' | 'tarde' | 'neutro';

export function calcularPuntualidad(
  transicion: TransicionEstado,
  transicionAnterior: TransicionEstado | null,
  cita: Cita,
): Puntualidad {
  if (transicion.nota?.includes('Retraso detectado automáticamente')) return 'tarde';

  if (transicion.estado === 'cancelada') return 'neutro';

  if (!transicionAnterior) return 'a_tiempo';

  const ts = new Date(transicion.timestamp).getTime();

  if (transicionAnterior.estado === 'programada' && transicion.estado === 'en_caseta') {
    const [h, m] = cita.ventanaInicio.split(':').map(Number);
    const ventanaInicio = new Date(`${cita.fechaProgramada}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`).getTime();
    const limite = ventanaInicio + MINUTOS_RETRASO * 60000;
    if (ts < ventanaInicio) return 'antes';
    if (ts > limite) return 'tarde';
    return 'a_tiempo';
  }

  if (transicionAnterior.estado === 'en_caseta' && transicion.estado === 'en_planta') {
    const limite = new Date(transicionAnterior.timestamp).getTime() + MINUTOS_RETRASO * 60000;
    if (ts > limite) return 'tarde';
    return 'a_tiempo';
  }

  if (transicionAnterior.estado === 'en_caseta' && transicion.estado === 'en_descarga') {
    const limite = new Date(transicionAnterior.timestamp).getTime() + MINUTOS_RETRASO * 60000;
    if (ts > limite) return 'tarde';
    return 'a_tiempo';
  }

  if (transicionAnterior.estado === 'en_descarga' && transicion.estado === 'completada') {
    const limite = new Date(transicionAnterior.timestamp).getTime() + MINUTOS_RETRASO * 60000;
    if (ts > limite) return 'tarde';
    return 'a_tiempo';
  }

  return 'a_tiempo';
}

export function colorPuntualidad(p: Puntualidad): string {
  switch (p) {
    case 'a_tiempo': return colores.status.active;
    case 'antes':   return colores.status.pending;
    case 'tarde':   return colores.status.error;
    case 'neutro':  return colores.status.archived;
  }
}


export function calcDuracion(inicio: string, fin: string): string {
  const diff = new Date(fin).getTime() - new Date(inicio).getTime();
  const totalMin = Math.max(0, Math.floor(diff / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m}m`;
}

export interface TiemposCita {
  tiempoCaseta: string;
  tiempoDescarga: string;
  tiempoTotal: string;
}

export function calcularTiempos(cita: Cita, transiciones: TransicionEstado[]): TiemposCita {
  const getTs = (estado: string) => {
    const t = transiciones.find(tr => tr.estado === estado);
    return t?.timestamp ?? null;
  };

  const tsCaseta = getTs('en_caseta');
  const tsDescarga = getTs('en_descarga');
  const tsCompletada = getTs('completada');

  const tsEntradaReal = cita.entrada?.timestamp ?? tsCaseta;
  const tsSalidaReal = cita.salida?.timestamp ?? tsCompletada;

  const tiempoCaseta = tsCaseta && tsDescarga ? calcDuracion(tsCaseta, tsDescarga) : '—';
  const tiempoDescarga = tsDescarga && tsCompletada ? calcDuracion(tsDescarga, tsCompletada) : '—';
  const tiempoTotal = tsEntradaReal && tsSalidaReal ? calcDuracion(tsEntradaReal, tsSalidaReal) : '—';

  return { tiempoCaseta, tiempoDescarga, tiempoTotal };
}
