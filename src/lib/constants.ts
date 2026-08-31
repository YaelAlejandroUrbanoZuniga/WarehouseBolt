import type { Cita, EstadoCita, Rol, SubEstadoCita, TransicionEstado } from './types';

export const ESQUEMA_VERSION = 6;

export const PLANTA_ID = 'planta-69';
export const PLANTA_NOMBRE = 'Planta 69';

export const ESTADOS: Record<EstadoCita, { nombre: string }> = {
  programada:      { nombre: 'Programada' },
  en_caseta:       { nombre: 'En caseta' },
  en_planta:       { nombre: 'En planta' },
  en_descarga:     { nombre: 'En descarga' },
  saliendo:        { nombre: 'Saliendo' },
  completada:      { nombre: 'Completada' },
  cancelada:       { nombre: 'Cancelada' },
};

export const FLUJO_PRINCIPAL: EstadoCita[] = [
  'programada', 'en_caseta', 'en_planta', 'en_descarga', 'saliendo', 'completada',
];

export const TRANSICIONES_PERMITIDAS: Record<EstadoCita, EstadoCita[]> = {
  programada:      ['en_caseta', 'en_planta', 'cancelada'],
  en_caseta:       ['en_planta', 'cancelada'],
  en_planta:       ['en_descarga', 'cancelada'],
  en_descarga:     ['saliendo'],
  saliendo:        ['completada'],
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
    const tieneSalidaDeCaseta = citaTransiciones.some(t => t.estado === 'en_planta' || t.estado === 'en_descarga');
    if (!tieneSalidaDeCaseta && ahora > limite) return 'retraso';
    return undefined;
  }

  if (cita.estado === 'en_planta') {
    const transicionPlanta = citaTransiciones.find(t => t.estado === 'en_planta');
    if (!transicionPlanta) return undefined;
    const limite = new Date(new Date(transicionPlanta.timestamp).getTime() + MINUTOS_RETRASO * 60000);
    const tieneDescarga = citaTransiciones.some(t => t.estado === 'en_descarga');
    if (!tieneDescarga && ahora > limite) return 'retraso';
    return undefined;
  }

  return undefined;
}
