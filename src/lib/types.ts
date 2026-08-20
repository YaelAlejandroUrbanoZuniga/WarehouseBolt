export type Rol = 'coordinador' | 'vigilancia' | 'almacen';

export type EstadoCita =
  | 'programada' | 'en_caseta' | 'en_planta' | 'en_descarga'
  | 'saliendo' | 'completada' | 'cancelada';

export type SubEstadoCita = 'retraso';

export type ResultadoAuditoria = 'completo' | 'incompleto' | 'danado';

export interface Usuario { id: string; nombre: string; rol: Rol; }
export interface Dock { id: string; nombre: string; activo: boolean; plantaId: string; }
export interface Transportista { id: string; empresa: string; }

export interface RegistroEntrada {
  operador: string;
  placas: string;
  numeroCaja: string;
  sello: string;
  timestamp: string;
}

export interface RegistroSalida {
  numeroCaja: string;
  sello: string;
  timestamp: string;
}

export interface TransicionEstado {
  id: string;
  citaId: string;
  estado: EstadoCita;
  usuarioNombre: string;
  timestamp: string;
  nota?: string;
}

export interface Cita {
  id: string;
  folio: string;
  codigoAcceso: string;
  poNumero: string;
  transportistaId: string;
  empresa: string;
  origen: string;
  destino: string;
  fechaProgramada: string;
  ventanaInicio: string;
  ventanaFin: string;
  dockId: string | null;
  estado: EstadoCita;
  plantaId: string;
  creadoPorNombre: string;
  entrada?: RegistroEntrada;
  salida?: RegistroSalida;
  documentacionRecibida?: boolean;
  resultadoAuditoria?: ResultadoAuditoria;
  notas?: string;
  subEstado?: SubEstadoCita;
}

export interface CitaInput {
  poNumero: string;
  transportistaId?: string;
  origen: string;
  destino: string;
  fechaProgramada: string;
  ventanaInicio: string;
  ventanaFin: string;
  notas?: string;
}

export interface CitaEditInput {
  poNumero: string;
  empresa: string;
  origen: string;
  destino: string;
  notas?: string;
}
