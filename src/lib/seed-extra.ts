import { addDays, format, subMinutes } from 'date-fns';
import type { Cita, Dock, TransicionEstado, Transportista, Proveedor, Usuario } from './types';
import { PLANTA_ID } from './constants';

function uid(): string { return crypto.randomUUID(); }
function iso(date: Date): string { return date.toISOString(); }
function hoyMasDias(n: number): string { return format(addDays(new Date(), n), 'yyyy-MM-dd'); }
function folioPara(fecha: string, consecutivo: number): string {
  return `DF-${fecha.replace(/-/g, '')}-${String(consecutivo).padStart(3, '0')}`;
}

interface SeedCtx {
  transportistas: Transportista[];
  proveedores: Proveedor[];
  docks: Dock[];
  usuarios: Usuario[];
  now: Date;
}

export function generarCitasExtra(ctx: SeedCtx): { citas: Cita[]; transiciones: TransicionEstado[] } {
  const { transportistas, proveedores, docks, usuarios, now } = ctx;
  const citas: Cita[] = [];
  const transiciones: TransicionEstado[] = [];

  function addT(citaId: string, estado: Cita['estado'], timestamp: Date, nota?: string) {
    transiciones.push({ id: uid(), citaId, estado, usuarioNombre: usuarios[0].nombre, timestamp: iso(timestamp), nota });
  }

  const c16Id = uid();
  citas.push({
    id: c16Id, folio: folioPara(hoyMasDias(4), 1), codigoAcceso: 'DF202608AAAAR', poNumero: 'PO-4516',
    transportistaId: transportistas[0].id, empresa: transportistas[0].empresa,
    proveedorId: proveedores[0].id, proveedorNombre: proveedores[0].nombre,
    origen: 'Celaya', destino: 'Almacén 69',
    fechaProgramada: hoyMasDias(4), ventanaInicio: '09:00', ventanaFin: '10:00',
    dockId: null, estado: 'programada', plantaId: PLANTA_ID,
    creadoPorNombre: usuarios[0].nombre,
    notas: 'Requiere rampa con acceso para doble remolque',
  });
  addT(c16Id, 'programada', subMinutes(now, 50));

  const c17Id = uid();
  citas.push({
    id: c17Id, folio: folioPara(hoyMasDias(8), 1), codigoAcceso: 'DF202608AAAAS', poNumero: 'PO-4517',
    transportistaId: transportistas[1].id, empresa: transportistas[1].empresa,
    proveedorId: proveedores[1].id, proveedorNombre: proveedores[1].nombre,
    origen: 'León', destino: 'Almacén 69',
    fechaProgramada: hoyMasDias(8), ventanaInicio: '08:00', ventanaFin: '10:00',
    dockId: null, estado: 'programada', plantaId: PLANTA_ID,
    creadoPorNombre: usuarios[0].nombre,
    notas: 'Transportista solicitó confirmación telefónica antes de llegar',
  });
  addT(c17Id, 'programada', subMinutes(now, 40));

  const c18Id = uid();
  const c18Entrada = subMinutes(now, 25);
  citas.push({
    id: c18Id, folio: folioPara(hoyMasDias(5), 1), codigoAcceso: 'DF202608AAAAT', poNumero: 'PO-4518',
    transportistaId: transportistas[2].id, empresa: transportistas[2].empresa,
    proveedorId: proveedores[2].id, proveedorNombre: proveedores[2].nombre,
    origen: 'Querétaro', destino: 'Almacén 69',
    fechaProgramada: hoyMasDias(5), ventanaInicio: '07:00', ventanaFin: '10:00',
    dockId: null, estado: 'en_caseta', plantaId: PLANTA_ID,
    creadoPorNombre: usuarios[0].nombre,
    entrada: { transportista: 'Mario Ortega', placas: 'QRO-333-G', numeroCaja: 'CJ-907', sello: 'SL-5007', timestamp: iso(c18Entrada) },
    notas: 'Entrega parcial — segunda parte programada la siguiente semana',
  });
  addT(c18Id, 'programada', subMinutes(now, 90));
  addT(c18Id, 'en_caseta', c18Entrada);

  const c19Id = uid();
  const c19Entrada = subMinutes(now, 15);
  citas.push({
    id: c19Id, folio: folioPara(hoyMasDias(9), 1), codigoAcceso: 'DF202608AAAAU', poNumero: 'PO-4519',
    transportistaId: transportistas[3].id, empresa: transportistas[3].empresa,
    proveedorId: proveedores[3].id, proveedorNombre: proveedores[3].nombre,
    origen: 'Irapuato', destino: 'Almacén 69',
    fechaProgramada: hoyMasDias(9), ventanaInicio: '10:00', ventanaFin: '12:00',
    dockId: null, estado: 'en_caseta', plantaId: PLANTA_ID,
    creadoPorNombre: usuarios[0].nombre,
    entrada: { transportista: 'Sergio Vargas', placas: 'GTO-444-H', numeroCaja: 'CJ-908', sello: 'SL-5008', timestamp: iso(c19Entrada) },
  });
  addT(c19Id, 'programada', subMinutes(now, 70));
  addT(c19Id, 'en_caseta', c19Entrada);

  const c20Id = uid();
  const c20Caseta = subMinutes(now, 35);
  const c20Descarga = subMinutes(now, 20);
  citas.push({
    id: c20Id, folio: folioPara(hoyMasDias(6), 1), codigoAcceso: 'DF202608AAAAV', poNumero: 'PO-4520',
    transportistaId: transportistas[4].id, empresa: transportistas[4].empresa,
    proveedorId: proveedores[4].id, proveedorNombre: proveedores[4].nombre,
    origen: 'San Luis Potosí', destino: 'Almacén 69',
    fechaProgramada: hoyMasDias(6), ventanaInicio: '09:00', ventanaFin: '10:00',
    dockId: docks[2].id, estado: 'en_descarga', plantaId: PLANTA_ID,
    creadoPorNombre: usuarios[0].nombre,
    entrada: { transportista: 'Andrés Soto', placas: 'SLP-555-J', numeroCaja: 'CJ-909', sello: 'SL-5009', timestamp: iso(c20Caseta) },
    notas: 'Documentación adicional: certificado de calidad adjunto por correo',
  });
  addT(c20Id, 'programada', subMinutes(now, 80));
  addT(c20Id, 'en_caseta', c20Caseta);
  addT(c20Id, 'en_descarga', c20Descarga);

  const c21Id = uid();
  const c21Caseta = subMinutes(now, 180);
  const c21Descarga = subMinutes(now, 150);
  const c21Completada = subMinutes(now, 100);
  citas.push({
    id: c21Id, folio: folioPara(hoyMasDias(7), 1), codigoAcceso: 'DF202608AAAAW', poNumero: 'PO-4521',
    transportistaId: transportistas[0].id, empresa: transportistas[0].empresa,
    proveedorId: proveedores[0].id, proveedorNombre: proveedores[0].nombre,
    origen: 'Aguascalientes', destino: 'Almacén 69',
    fechaProgramada: hoyMasDias(7), ventanaInicio: '08:00', ventanaFin: '10:00',
    dockId: docks[3].id, estado: 'completada', plantaId: PLANTA_ID,
    creadoPorNombre: usuarios[0].nombre,
    entrada: { transportista: 'Pedro Nava', placas: 'AGS-666-K', numeroCaja: 'CJ-910', sello: 'SL-5011', timestamp: iso(c21Caseta) },
    salida: { numeroCaja: 'CJ-910', sello: 'SL-5012', timestamp: iso(c21Completada) },
  });
  addT(c21Id, 'programada', subMinutes(now, 220));
  addT(c21Id, 'en_caseta', c21Caseta);
  addT(c21Id, 'en_descarga', c21Descarga);
  addT(c21Id, 'completada', c21Completada);

  const c22Id = uid();
  const c22Programada = subMinutes(now, 120);
  const c22Cancelada = subMinutes(now, 60);
  citas.push({
    id: c22Id, folio: folioPara(hoyMasDias(10), 1), codigoAcceso: 'DF202608AAAAX', poNumero: 'PO-4522',
    transportistaId: transportistas[1].id, empresa: transportistas[1].empresa,
    proveedorId: proveedores[1].id, proveedorNombre: proveedores[1].nombre,
    origen: 'CDMX', destino: 'Almacén 69',
    fechaProgramada: hoyMasDias(10), ventanaInicio: '11:00', ventanaFin: '13:00',
    dockId: null, estado: 'cancelada', plantaId: PLANTA_ID,
    creadoPorNombre: usuarios[0].nombre,
    notas: 'Cancelada por el cliente',
  });
  addT(c22Id, 'programada', c22Programada);
  addT(c22Id, 'cancelada', c22Cancelada, 'Cancelada por el cliente');

  const c23Id = uid();
  citas.push({
    id: c23Id, folio: folioPara(hoyMasDias(11), 1), codigoAcceso: 'DF202608AAAAY', poNumero: 'PO-4523',
    transportistaId: transportistas[2].id, empresa: transportistas[2].empresa,
    proveedorId: proveedores[2].id, proveedorNombre: proveedores[2].nombre,
    origen: 'Monterrey', destino: 'Almacén 69',
    fechaProgramada: hoyMasDias(11), ventanaInicio: '06:00', ventanaFin: '09:00',
    dockId: null, estado: 'programada', plantaId: PLANTA_ID,
    creadoPorNombre: usuarios[0].nombre,
    notas: 'Requiere rampa con acceso para doble remolque',
  });
  addT(c23Id, 'programada', subMinutes(now, 30));

  return { citas, transiciones };
}
