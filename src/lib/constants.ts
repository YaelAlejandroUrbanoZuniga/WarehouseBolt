import type { Cita, EstadoCita, Rol, SubEstadoCita, TransicionEstado } from './types';

// Incrementar cada vez que el shape de Cita, TransicionEstado o EstadoCita
// cambie de forma incompatible con datos almacenados en localStorage.
export const ESQUEMA_VERSION = 2;

export const PLANTA_ID = 'planta-69';
export const PLANTA_NOMBRE = 'Planta 69';

export const ESTADOS: Record<EstadoCita, { nombre: string; insignia: 'active' | 'pending' | 'warning' | 'error' | 'info' | 'archived' }> = {
  programada:      { nombre: 'Programada',      insignia: 'info' },
  en_caseta:       { nombre: 'En caseta',       insignia: 'pending' },
  en_descarga:     { nombre: 'En descarga',     insignia: 'warning' },
  completada:      { nombre: 'Completada',      insignia: 'active' },
  cancelada:       { nombre: 'Cancelada',       insignia: 'archived' },
};

export const FLUJO_PRINCIPAL: EstadoCita[] = [
  'programada', 'en_caseta', 'en_descarga', 'completada',
];

export const TRANSICIONES_PERMITIDAS: Record<EstadoCita, EstadoCita[]> = {
  programada:      ['en_caseta', 'cancelada'],
  en_caseta:       ['en_descarga', 'cancelada'],
  en_descarga:     ['completada'],
  completada:      [],
  cancelada:       [],
};

export const ROL_ETIQUETA: Record<Rol, string> = {
  coordinador: 'Coordinador',
  vigilancia: 'Vigilancia',
  almacen: 'Almacén',
};

export const ROLES: Rol[] = ['coordinador', 'vigilancia', 'almacen'];

export const MINUTOS_RETRASO = 30;

export function calcularSubEstado(
  cita: Cita,
  transiciones: TransicionEstado[],
  ahora: Date,
): SubEstadoCita | undefined {
  const citaTransiciones = transiciones.filter(t => t.citaId === cita.id);

  if (cita.estado === 'programada') {
    const [horas, minutos] = cita.ventanaInicio.split(':').map(Number);
    const ventana = new Date(`${cita.fechaProgramada}T${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:00`);
    const limite = new Date(ventana.getTime() + MINUTOS_RETRASO * 60000);
    const tieneCaseta = citaTransiciones.some(t => t.estado === 'en_caseta');
    if (!tieneCaseta && ahora > limite) return 'retraso';
    return undefined;
  }

  if (cita.estado === 'en_caseta') {
    const transicionCaseta = citaTransiciones.find(t => t.estado === 'en_caseta');
    if (!transicionCaseta) return undefined;
    const limite = new Date(new Date(transicionCaseta.timestamp).getTime() + MINUTOS_RETRASO * 60000);
    const tieneDescarga = citaTransiciones.some(t => t.estado === 'en_descarga');
    if (!tieneDescarga && ahora > limite) return 'retraso';
    return undefined;
  }

  return undefined;
}
