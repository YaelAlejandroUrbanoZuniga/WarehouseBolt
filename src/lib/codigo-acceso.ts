import { format } from 'date-fns';
import type { Cita } from './types';

const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomChars(n: number): string {
  let result = '';
  for (let i = 0; i < n; i++) {
    result += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
  }
  return result;
}

export function generarCodigoAcceso(citasExistentes: Cita[]): string {
  const prefijo = 'DF' + format(new Date(), 'yyyyMM');
  const existentes = new Set(citasExistentes.map(c => c.codigoAcceso));
  let codigo: string;
  do {
    codigo = prefijo + randomChars(5);
  } while (existentes.has(codigo));
  return codigo;
}

export function buscarPorCodigo(codigo: string, citas: Cita[]): Cita | null {
  const normalizado = codigo.trim().toUpperCase();
  return citas.find(c => c.codigoAcceso.toUpperCase() === normalizado) ?? null;
}
