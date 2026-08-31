import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { format, subMinutes, addDays } from 'date-fns';
import type { Cita, Dock, Transportista, TransicionEstado, Usuario, Proveedor } from './types';
import { PLANTA_ID } from './constants';
import {
  citasAtom, transicionesAtom, docksAtom, transportistasAtom, usuariosAtom, proveedoresAtom,
} from './store';
import { generarCitasExtra } from './seed-extra';

function uid(): string {
  return crypto.randomUUID();
}

function iso(date: Date): string {
  return date.toISOString();
}

function hoy(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function manana(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return format(d, 'yyyy-MM-dd');
}

function hoyMasDias(n: number): string {
  return format(addDays(new Date(), n), 'yyyy-MM-dd');
}

function folioPara(fecha: string, consecutivo: number): string {
  return `DF-${fecha.replace(/-/g, '')}-${String(consecutivo).padStart(3, '0')}`;
}

export function useSembrarDatos(): void {
  const citas = useAtomValue(citasAtom);
  const setCitas = useSetAtom(citasAtom);
  const setTransiciones = useSetAtom(transicionesAtom);
  const setDocks = useSetAtom(docksAtom);
  const setTransportistas = useSetAtom(transportistasAtom);
  const setUsuarios = useSetAtom(usuariosAtom);
  const setProveedores = useSetAtom(proveedoresAtom);

  useEffect(() => {
    if (citas.length > 0) return;

    const usuarios: Usuario[] = [
      { id: uid(), nombre: 'Carlos Mendoza', rol: 'coordinador' },
      { id: uid(), nombre: 'Laura Ríos', rol: 'vigilancia' },
      { id: uid(), nombre: 'Miguel Torres', rol: 'almacen' },
    ];

    const docks: Dock[] = [
      { id: uid(), nombre: 'Rampa 1', activo: true, plantaId: PLANTA_ID },
      { id: uid(), nombre: 'Rampa 2', activo: true, plantaId: PLANTA_ID },
      { id: uid(), nombre: 'Rampa 3', activo: true, plantaId: PLANTA_ID },
      { id: uid(), nombre: 'Rampa 4', activo: true, plantaId: PLANTA_ID },
    ];

    const transportistas: Transportista[] = [
      { id: uid(), empresa: 'Transportes del Bajío' },
      { id: uid(), empresa: 'Fletes Nacionales SA' },
      { id: uid(), empresa: 'Logística Express' },
      { id: uid(), empresa: 'Carga Rápida MX' },
      { id: uid(), empresa: 'Envíos Centrales' },
    ];

    const proveedores: Proveedor[] = [
      {
        id: uid(), nombre: 'Aceros del Norte', codigo: 'PROV-001',
        origenPredeterminado: 'Monterrey',
        contactoNombre: 'Ricardo Salinas', contactoTelefono: '+52 81 1234 5678',
        contactoCorreo: 'rsalinas@acerosdelnorte.mx',
        lineaTransporteHabitual: 'Transportes del Bajío', activo: true,
      },
      {
        id: uid(), nombre: 'Polímeros Guanajuato', codigo: 'PROV-002',
        origenPredeterminado: 'Celaya',
        contactoNombre: 'Ana Gutiérrez', contactoTelefono: '+52 461 987 6543',
        contactoCorreo: 'agutierrez@polimerosgto.com',
        lineaTransporteHabitual: 'Fletes Nacionales SA', activo: true,
      },
      {
        id: uid(), nombre: 'Componentes Electrónicos MX', codigo: 'PROV-003',
        origenPredeterminado: 'Querétaro',
        contactoNombre: 'Jorge Hernández', contactoTelefono: '+52 442 555 1122',
        contactoCorreo: 'jhernandez@compelectmx.com',
        lineaTransporteHabitual: 'Logística Express', activo: true,
      },
      {
        id: uid(), nombre: 'Empaques Industriales del Centro', codigo: 'PROV-004',
        origenPredeterminado: 'Irapuato',
        contactoNombre: 'María del Carmen López', contactoTelefono: '+52 462 333 4455',
        contactoCorreo: 'mlopez@empaquescentro.mx',
        lineaTransporteHabitual: 'Carga Rápida MX', activo: true,
      },
      {
        id: uid(), nombre: 'Químicos y Solventes SLP', codigo: 'PROV-005',
        origenPredeterminado: 'San Luis Potosí',
        contactoNombre: 'Fernando Castillo', contactoTelefono: '+52 444 777 8899',
        contactoCorreo: 'fcastillo@quimicosslp.com',
        lineaTransporteHabitual: 'Envíos Centrales', activo: true,
      },
    ];

    const now = new Date();
    const transiciones: TransicionEstado[] = [];
    const citasArr: Cita[] = [];

    function addTransicion(citaId: string, estado: Cita['estado'], timestamp: Date, nota?: string) {
      transiciones.push({
        id: uid(), citaId, estado, usuarioNombre: usuarios[0].nombre,
        timestamp: iso(timestamp), nota,
      });
    }

    // 3 programadas: 1 hoy, 2 mañana
    const c1Id = uid();
    citasArr.push({
      id: c1Id, folio: folioPara(hoy(), 1), codigoAcceso: 'DF202608AAAAA', poNumero: 'PO-4501',
      transportistaId: transportistas[0].id, empresa: transportistas[0].empresa,
      proveedorId: proveedores[0].id, proveedorNombre: proveedores[0].nombre,
      origen: 'Celaya', destino: 'Almacén 69',
      fechaProgramada: hoy(), ventanaInicio: '10:00', ventanaFin: '12:00',
      dockId: null, estado: 'programada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
    });
    addTransicion(c1Id, 'programada', subMinutes(now, 300));

    const c2Id = uid();
    citasArr.push({
      id: c2Id, folio: folioPara(manana(), 1), codigoAcceso: 'DF202608AAAAB', poNumero: 'PO-4502',
      transportistaId: transportistas[1].id, empresa: transportistas[1].empresa,
      proveedorId: proveedores[1].id, proveedorNombre: proveedores[1].nombre,
      origen: 'León', destino: 'Almacén 69',
      fechaProgramada: manana(), ventanaInicio: '08:00', ventanaFin: '10:00',
      dockId: null, estado: 'programada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
    });
    addTransicion(c2Id, 'programada', subMinutes(now, 240));

    const c3Id = uid();
    citasArr.push({
      id: c3Id, folio: folioPara(manana(), 2), codigoAcceso: 'DF202608AAAAC', poNumero: 'PO-4503',
      transportistaId: transportistas[2].id, empresa: transportistas[2].empresa,
      proveedorId: proveedores[2].id, proveedorNombre: proveedores[2].nombre,
      origen: 'Querétaro', destino: 'Almacén 69',
      fechaProgramada: manana(), ventanaInicio: '14:00', ventanaFin: '16:00',
      dockId: null, estado: 'programada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
    });
    addTransicion(c3Id, 'programada', subMinutes(now, 200));

    // 2 en_caseta (one recent, one waiting longer)
    const c4Id = uid();
    const c4Entrada = subMinutes(now, 20);
    citasArr.push({
      id: c4Id, folio: folioPara(hoy(), 2), codigoAcceso: 'DF202608AAAAD', poNumero: 'PO-4504',
      transportistaId: transportistas[3].id, empresa: transportistas[3].empresa,
      proveedorId: proveedores[3].id, proveedorNombre: proveedores[3].nombre,
      origen: 'Irapuato', destino: 'Almacén 69',
      fechaProgramada: hoy(), ventanaInicio: '18:00', ventanaFin: '20:00',
      dockId: null, estado: 'en_caseta', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      entrada: {
        transportista: 'Juan Pérez', placas: 'GTO-123-A',
        numeroCaja: 'CJ-901', sello: 'SL-5001', timestamp: iso(c4Entrada),
      },
    });
    addTransicion(c4Id, 'programada', subMinutes(now, 180));
    addTransicion(c4Id, 'en_caseta', c4Entrada);

    const c5Id = uid();
    const c5Caseta = subMinutes(now, 55);
    const c5Planta = subMinutes(now, 40);
    citasArr.push({
      id: c5Id, folio: folioPara(hoy(), 3), codigoAcceso: 'DF202608AAAAE', poNumero: 'PO-4505',
      transportistaId: transportistas[4].id, empresa: transportistas[4].empresa,
      proveedorId: proveedores[4].id, proveedorNombre: proveedores[4].nombre,
      origen: 'San Luis Potosí', destino: 'Almacén 69',
      fechaProgramada: hoy(), ventanaInicio: '07:00', ventanaFin: '09:00',
      dockId: null, estado: 'en_planta', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      entrada: {
        transportista: 'Roberto Sánchez', placas: 'SLP-456-B',
        numeroCaja: 'CJ-902', sello: 'SL-5002', timestamp: iso(c5Caseta),
      },
    });
    addTransicion(c5Id, 'programada', subMinutes(now, 300));
    addTransicion(c5Id, 'en_caseta', c5Caseta);
    addTransicion(c5Id, 'en_planta', c5Planta);

    const c6Id = uid();
    const c6Caseta = subMinutes(now, 160);
    const c6Planta = subMinutes(now, 130);
    citasArr.push({
      id: c6Id, folio: folioPara(hoy(), 4), codigoAcceso: 'DF202608AAAAF', poNumero: 'PO-4506',
      transportistaId: transportistas[0].id, empresa: transportistas[0].empresa,
      proveedorId: proveedores[0].id, proveedorNombre: proveedores[0].nombre,
      origen: 'Aguascalientes', destino: 'Almacén 69',
      fechaProgramada: hoy(), ventanaInicio: '03:00', ventanaFin: '05:00',
      dockId: null, estado: 'en_planta', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      entrada: {
        transportista: 'Fernando Díaz', placas: 'AGS-789-C',
        numeroCaja: 'CJ-903', sello: 'SL-5003', timestamp: iso(c6Caseta),
      },
    });
    addTransicion(c6Id, 'programada', subMinutes(now, 360));
    addTransicion(c6Id, 'en_caseta', c6Caseta);
    addTransicion(c6Id, 'en_planta', c6Planta);

    // 1 en_descarga con dockId — now moves to 'saliendo'
    const c7Id = uid();
    const c7Caseta = subMinutes(now, 90);
    const c7Descarga = subMinutes(now, 60);
    const c7Saliendo = subMinutes(now, 30);
    citasArr.push({
      id: c7Id, folio: folioPara(hoy(), 5), codigoAcceso: 'DF202608AAAAG', poNumero: 'PO-4507',
      transportistaId: transportistas[1].id, empresa: transportistas[1].empresa,
      proveedorId: proveedores[1].id, proveedorNombre: proveedores[1].nombre,
      origen: 'CDMX', destino: 'Almacén 69',
      fechaProgramada: hoy(), ventanaInicio: '12:00', ventanaFin: '14:00',
      dockId: docks[0].id, estado: 'saliendo', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      entrada: {
        transportista: 'Arturo Vega', placas: 'MEX-321-D',
        numeroCaja: 'CJ-904', sello: 'SL-5004', timestamp: iso(c7Caseta),
      },
    });
    addTransicion(c7Id, 'programada', subMinutes(now, 400));
    addTransicion(c7Id, 'en_caseta', c7Caseta);
    addTransicion(c7Id, 'en_descarga', c7Descarga);
    addTransicion(c7Id, 'saliendo', c7Saliendo);

    // 1 completada
    const c8Id = uid();
    const c8Caseta = subMinutes(now, 240);
    const c8Descarga = subMinutes(now, 200);
    const c8Completada = subMinutes(now, 140);
    citasArr.push({
      id: c8Id, folio: folioPara(hoy(), 6), codigoAcceso: 'DF202608AAAAH', poNumero: 'PO-4508',
      transportistaId: transportistas[2].id, empresa: transportistas[2].empresa,
      proveedorId: proveedores[2].id, proveedorNombre: proveedores[2].nombre,
      origen: 'Monterrey', destino: 'Almacén 69',
      fechaProgramada: hoy(), ventanaInicio: '05:00', ventanaFin: '07:00',
      dockId: docks[1].id, estado: 'completada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      entrada: {
        transportista: 'Luis Ramírez', placas: 'NL-654-E',
        numeroCaja: 'CJ-905', sello: 'SL-5005', timestamp: iso(c8Caseta),
      },
      salida: {
        numeroCaja: 'CJ-905', sello: 'SL-5010', timestamp: iso(c8Completada),
      },
    });
    addTransicion(c8Id, 'programada', subMinutes(now, 480));
    addTransicion(c8Id, 'en_caseta', c8Caseta);
    addTransicion(c8Id, 'en_descarga', c8Descarga);
    addTransicion(c8Id, 'completada', c8Completada);

    // --- Citas adicionales para mayor variedad visual ---

    // 2 canceladas
    const c9Id = uid();
    const c9Programada = subMinutes(now, 90);
    const c9Cancelada = subMinutes(now, 75);
    citasArr.push({
      id: c9Id, folio: folioPara(hoy(), 7), codigoAcceso: 'DF202608AAAAJ', poNumero: 'PO-4509',
      transportistaId: transportistas[3].id, empresa: transportistas[3].empresa,
      proveedorId: proveedores[3].id, proveedorNombre: proveedores[3].nombre,
      origen: 'Puebla', destino: 'Almacén 69',
      fechaProgramada: hoy(), ventanaInicio: '11:00', ventanaFin: '13:00',
      dockId: null, estado: 'cancelada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
    });
    addTransicion(c9Id, 'programada', c9Programada);
    addTransicion(c9Id, 'cancelada', c9Cancelada, 'Cancelada por el cliente');

    const c10Id = uid();
    const c10Programada = subMinutes(now, 600);
    const c10Cancelada = subMinutes(now, 180);
    citasArr.push({
      id: c10Id, folio: folioPara(hoyMasDias(2), 1), codigoAcceso: 'DF202608AAAAK', poNumero: 'PO-4510',
      transportistaId: transportistas[4].id, empresa: transportistas[4].empresa,
      proveedorId: proveedores[4].id, proveedorNombre: proveedores[4].nombre,
      origen: 'Toluca', destino: 'Almacén 69',
      fechaProgramada: hoyMasDias(2), ventanaInicio: '09:00', ventanaFin: '11:00',
      dockId: null, estado: 'cancelada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
    });
    addTransicion(c10Id, 'programada', c10Programada);
    addTransicion(c10Id, 'cancelada', c10Cancelada, 'Cancelada por indisponibilidad del transportista');

    // 1 programada a 3 días en el futuro
    const c11Id = uid();
    citasArr.push({
      id: c11Id, folio: folioPara(hoyMasDias(3), 1), codigoAcceso: 'DF202608AAAAL', poNumero: 'PO-4511',
      transportistaId: transportistas[0].id, empresa: transportistas[0].empresa,
      proveedorId: proveedores[0].id, proveedorNombre: proveedores[0].nombre,
      origen: 'Guanajuato', destino: 'Almacén 69',
      fechaProgramada: hoyMasDias(3), ventanaInicio: '10:00', ventanaFin: '12:00',
      dockId: null, estado: 'programada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
    });
    addTransicion(c11Id, 'programada', subMinutes(now, 30));

    // 1 programada con ventanaInicio en el pasado (retraso en vivo)
    const c12Id = uid();
    citasArr.push({
      id: c12Id, folio: folioPara(hoy(), 8), codigoAcceso: 'DF202608AAAAM', poNumero: 'PO-4512',
      transportistaId: transportistas[1].id, empresa: transportistas[1].empresa,
      proveedorId: proveedores[1].id, proveedorNombre: proveedores[1].nombre,
      origen: 'Salamanca', destino: 'Almacén 69',
      fechaProgramada: hoy(), ventanaInicio: '14:00', ventanaFin: '16:00',
      dockId: null, estado: 'programada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
    });
    addTransicion(c12Id, 'programada', subMinutes(now, 240));

    // 1 en_caseta con entrada hace más de 30 min sin avanzar (retraso en vivo)
    const c13Id = uid();
    const c13Entrada = subMinutes(now, 45);
    citasArr.push({
      id: c13Id, folio: folioPara(hoy(), 9), codigoAcceso: 'DF202608AAAAN', poNumero: 'PO-4513',
      transportistaId: transportistas[2].id, empresa: transportistas[2].empresa,
      proveedorId: proveedores[2].id, proveedorNombre: proveedores[2].nombre,
      origen: 'Cortazar', destino: 'Almacén 69',
      fechaProgramada: hoy(), ventanaInicio: '16:00', ventanaFin: '18:00',
      dockId: null, estado: 'en_caseta', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      entrada: {
        transportista: 'Héctor Moreno', placas: 'GTO-222-F',
        numeroCaja: 'CJ-906', sello: 'SL-5006', timestamp: iso(c13Entrada),
      },
    });
    addTransicion(c13Id, 'programada', subMinutes(now, 200));
    addTransicion(c13Id, 'en_caseta', c13Entrada);

    // 1 programada muy temprano (01:00)
    const c14Id = uid();
    citasArr.push({
      id: c14Id, folio: folioPara(hoyMasDias(1), 1), codigoAcceso: 'DF202608AAAAP', poNumero: 'PO-4514',
      transportistaId: transportistas[3].id, empresa: transportistas[3].empresa,
      proveedorId: proveedores[3].id, proveedorNombre: proveedores[3].nombre,
      origen: 'San Miguel de Allende', destino: 'Almacén 69',
      fechaProgramada: hoyMasDias(1), ventanaInicio: '01:00', ventanaFin: '03:00',
      dockId: null, estado: 'programada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
    });
    addTransicion(c14Id, 'programada', subMinutes(now, 60));

    // 1 programada muy tarde (23:00)
    const c15Id = uid();
    citasArr.push({
      id: c15Id, folio: folioPara(hoyMasDias(2), 2), codigoAcceso: 'DF202608AAAAQ', poNumero: 'PO-4515',
      transportistaId: transportistas[4].id, empresa: transportistas[4].empresa,
      proveedorId: proveedores[4].id, proveedorNombre: proveedores[4].nombre,
      origen: 'Dolores Hidalgo', destino: 'Almacén 69',
      fechaProgramada: hoyMasDias(2), ventanaInicio: '23:00', ventanaFin: '01:00',
      dockId: null, estado: 'programada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
    });
    addTransicion(c15Id, 'programada', subMinutes(now, 120));

    const extra = generarCitasExtra({ transportistas, proveedores, docks, usuarios, now });
    citasArr.push(...extra.citas);
    transiciones.push(...extra.transiciones);

    setCitas(citasArr);
    setTransiciones(transiciones);
    setDocks(docks);
    setTransportistas(transportistas);
    setUsuarios(usuarios);
    setProveedores(proveedores);
  }, [citas.length, setCitas, setTransiciones, setDocks, setTransportistas, setUsuarios, setProveedores]);
}
