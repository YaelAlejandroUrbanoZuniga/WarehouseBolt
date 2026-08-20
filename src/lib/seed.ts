import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { format, subMinutes, addDays } from 'date-fns';
import type { Cita, Dock, Transportista, TransicionEstado, Usuario } from './types';
import { PLANTA_ID } from './constants';
import {
  citasAtom, transicionesAtom, docksAtom, transportistasAtom, usuariosAtom,
} from './store';

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
      id: c1Id, folio: folioPara(hoy(), 1), poNumero: 'PO-4501',
      transportistaId: transportistas[0].id, empresa: transportistas[0].empresa,
      origen: 'Celaya', destino: 'Almacén 69',
      fechaProgramada: hoy(), ventanaInicio: '10:00', ventanaFin: '12:00',
      dockId: null, estado: 'programada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
    });
    addTransicion(c1Id, 'programada', subMinutes(now, 300));

    const c2Id = uid();
    citasArr.push({
      id: c2Id, folio: folioPara(manana(), 1), poNumero: 'PO-4502',
      transportistaId: transportistas[1].id, empresa: transportistas[1].empresa,
      origen: 'León', destino: 'Almacén 69',
      fechaProgramada: manana(), ventanaInicio: '08:00', ventanaFin: '10:00',
      dockId: null, estado: 'programada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
    });
    addTransicion(c2Id, 'programada', subMinutes(now, 240));

    const c3Id = uid();
    citasArr.push({
      id: c3Id, folio: folioPara(manana(), 2), poNumero: 'PO-4503',
      transportistaId: transportistas[2].id, empresa: transportistas[2].empresa,
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
      id: c4Id, folio: folioPara(hoy(), 2), poNumero: 'PO-4504',
      transportistaId: transportistas[3].id, empresa: transportistas[3].empresa,
      origen: 'Irapuato', destino: 'Almacén 69',
      fechaProgramada: hoy(), ventanaInicio: '18:00', ventanaFin: '20:00',
      dockId: null, estado: 'en_caseta', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      entrada: {
        operador: 'Juan Pérez', placas: 'GTO-123-A',
        numeroCaja: 'CJ-901', sello: 'SL-5001', timestamp: iso(c4Entrada),
      },
    });
    addTransicion(c4Id, 'programada', subMinutes(now, 180));
    addTransicion(c4Id, 'en_caseta', c4Entrada);

    const c5Id = uid();
    const c5Caseta = subMinutes(now, 55);
    citasArr.push({
      id: c5Id, folio: folioPara(hoy(), 3), poNumero: 'PO-4505',
      transportistaId: transportistas[4].id, empresa: transportistas[4].empresa,
      origen: 'San Luis Potosí', destino: 'Almacén 69',
      fechaProgramada: hoy(), ventanaInicio: '07:00', ventanaFin: '09:00',
      dockId: null, estado: 'en_caseta', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      entrada: {
        operador: 'Roberto Sánchez', placas: 'SLP-456-B',
        numeroCaja: 'CJ-902', sello: 'SL-5002', timestamp: iso(c5Caseta),
      },
    });
    addTransicion(c5Id, 'programada', subMinutes(now, 300));
    addTransicion(c5Id, 'en_caseta', c5Caseta);

    const c6Id = uid();
    const c6Caseta = subMinutes(now, 160);
    citasArr.push({
      id: c6Id, folio: folioPara(hoy(), 4), poNumero: 'PO-4506',
      transportistaId: transportistas[0].id, empresa: transportistas[0].empresa,
      origen: 'Aguascalientes', destino: 'Almacén 69',
      fechaProgramada: hoy(), ventanaInicio: '03:00', ventanaFin: '05:00',
      dockId: null, estado: 'en_caseta', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      entrada: {
        operador: 'Fernando Díaz', placas: 'AGS-789-C',
        numeroCaja: 'CJ-903', sello: 'SL-5003', timestamp: iso(c6Caseta),
      },
    });
    addTransicion(c6Id, 'programada', subMinutes(now, 360));
    addTransicion(c6Id, 'en_caseta', c6Caseta);

    // 1 en_descarga con dockId
    const c7Id = uid();
    const c7Caseta = subMinutes(now, 90);
    const c7Descarga = subMinutes(now, 60);
    citasArr.push({
      id: c7Id, folio: folioPara(hoy(), 5), poNumero: 'PO-4507',
      transportistaId: transportistas[1].id, empresa: transportistas[1].empresa,
      origen: 'CDMX', destino: 'Almacén 69',
      fechaProgramada: hoy(), ventanaInicio: '12:00', ventanaFin: '14:00',
      dockId: docks[0].id, estado: 'en_descarga', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      entrada: {
        operador: 'Arturo Vega', placas: 'MEX-321-D',
        numeroCaja: 'CJ-904', sello: 'SL-5004', timestamp: iso(c7Caseta),
      },
    });
    addTransicion(c7Id, 'programada', subMinutes(now, 400));
    addTransicion(c7Id, 'en_caseta', c7Caseta);
    addTransicion(c7Id, 'en_descarga', c7Descarga);

    // 1 completada
    const c8Id = uid();
    const c8Caseta = subMinutes(now, 240);
    const c8Descarga = subMinutes(now, 200);
    const c8Completada = subMinutes(now, 140);
    citasArr.push({
      id: c8Id, folio: folioPara(hoy(), 6), poNumero: 'PO-4508',
      transportistaId: transportistas[2].id, empresa: transportistas[2].empresa,
      origen: 'Monterrey', destino: 'Almacén 69',
      fechaProgramada: hoy(), ventanaInicio: '05:00', ventanaFin: '07:00',
      dockId: docks[1].id, estado: 'completada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      entrada: {
        operador: 'Luis Ramírez', placas: 'NL-654-E',
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
      id: c9Id, folio: folioPara(hoy(), 7), poNumero: 'PO-4509',
      transportistaId: transportistas[3].id, empresa: transportistas[3].empresa,
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
      id: c10Id, folio: folioPara(hoyMasDias(2), 1), poNumero: 'PO-4510',
      transportistaId: transportistas[4].id, empresa: transportistas[4].empresa,
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
      id: c11Id, folio: folioPara(hoyMasDias(3), 1), poNumero: 'PO-4511',
      transportistaId: transportistas[0].id, empresa: transportistas[0].empresa,
      origen: 'Guanajuato', destino: 'Almacén 69',
      fechaProgramada: hoyMasDias(3), ventanaInicio: '10:00', ventanaFin: '12:00',
      dockId: null, estado: 'programada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
    });
    addTransicion(c11Id, 'programada', subMinutes(now, 30));

    // 1 programada con ventanaInicio en el pasado (retraso en vivo)
    const c12Id = uid();
    citasArr.push({
      id: c12Id, folio: folioPara(hoy(), 8), poNumero: 'PO-4512',
      transportistaId: transportistas[1].id, empresa: transportistas[1].empresa,
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
      id: c13Id, folio: folioPara(hoy(), 9), poNumero: 'PO-4513',
      transportistaId: transportistas[2].id, empresa: transportistas[2].empresa,
      origen: 'Cortazar', destino: 'Almacén 69',
      fechaProgramada: hoy(), ventanaInicio: '16:00', ventanaFin: '18:00',
      dockId: null, estado: 'en_caseta', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      entrada: {
        operador: 'Héctor Moreno', placas: 'GTO-222-F',
        numeroCaja: 'CJ-906', sello: 'SL-5006', timestamp: iso(c13Entrada),
      },
    });
    addTransicion(c13Id, 'programada', subMinutes(now, 200));
    addTransicion(c13Id, 'en_caseta', c13Entrada);

    // 1 programada muy temprano (01:00)
    const c14Id = uid();
    citasArr.push({
      id: c14Id, folio: folioPara(hoyMasDias(1), 1), poNumero: 'PO-4514',
      transportistaId: transportistas[3].id, empresa: transportistas[3].empresa,
      origen: 'San Miguel de Allende', destino: 'Almacén 69',
      fechaProgramada: hoyMasDias(1), ventanaInicio: '01:00', ventanaFin: '03:00',
      dockId: null, estado: 'programada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
    });
    addTransicion(c14Id, 'programada', subMinutes(now, 60));

    // 1 programada muy tarde (23:00)
    const c15Id = uid();
    citasArr.push({
      id: c15Id, folio: folioPara(hoyMasDias(2), 2), poNumero: 'PO-4515',
      transportistaId: transportistas[4].id, empresa: transportistas[4].empresa,
      origen: 'Dolores Hidalgo', destino: 'Almacén 69',
      fechaProgramada: hoyMasDias(2), ventanaInicio: '23:00', ventanaFin: '01:00',
      dockId: null, estado: 'programada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
    });
    addTransicion(c15Id, 'programada', subMinutes(now, 120));

    // --- Citas adicionales con notas, duraciones y semanas variadas ---

    // 1 programada, ventana 1h, semana actual, con nota
    const c16Id = uid();
    citasArr.push({
      id: c16Id, folio: folioPara(hoyMasDias(4), 1), poNumero: 'PO-4516',
      transportistaId: transportistas[0].id, empresa: transportistas[0].empresa,
      origen: 'Celaya', destino: 'Almacén 69',
      fechaProgramada: hoyMasDias(4), ventanaInicio: '09:00', ventanaFin: '10:00',
      dockId: null, estado: 'programada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      notas: 'Requiere rampa con acceso para doble remolque',
    });
    addTransicion(c16Id, 'programada', subMinutes(now, 50));

    // 1 programada, ventana 2h, semana siguiente, con nota
    const c17Id = uid();
    citasArr.push({
      id: c17Id, folio: folioPara(hoyMasDias(8), 1), poNumero: 'PO-4517',
      transportistaId: transportistas[1].id, empresa: transportistas[1].empresa,
      origen: 'León', destino: 'Almacén 69',
      fechaProgramada: hoyMasDias(8), ventanaInicio: '08:00', ventanaFin: '10:00',
      dockId: null, estado: 'programada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      notas: 'Transportista solicitó confirmación telefónica antes de llegar',
    });
    addTransicion(c17Id, 'programada', subMinutes(now, 40));

    // 1 en_caseta, ventana 3h, semana actual, con nota
    const c18Id = uid();
    const c18Entrada = subMinutes(now, 25);
    citasArr.push({
      id: c18Id, folio: folioPara(hoyMasDias(5), 1), poNumero: 'PO-4518',
      transportistaId: transportistas[2].id, empresa: transportistas[2].empresa,
      origen: 'Querétaro', destino: 'Almacén 69',
      fechaProgramada: hoyMasDias(5), ventanaInicio: '07:00', ventanaFin: '10:00',
      dockId: null, estado: 'en_caseta', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      entrada: {
        operador: 'Mario Ortega', placas: 'QRO-333-G',
        numeroCaja: 'CJ-907', sello: 'SL-5007', timestamp: iso(c18Entrada),
      },
      notas: 'Entrega parcial — segunda parte programada la siguiente semana',
    });
    addTransicion(c18Id, 'programada', subMinutes(now, 90));
    addTransicion(c18Id, 'en_caseta', c18Entrada);

    // 1 en_caseta, ventana 2h, semana siguiente
    const c19Id = uid();
    const c19Entrada = subMinutes(now, 15);
    citasArr.push({
      id: c19Id, folio: folioPara(hoyMasDias(9), 1), poNumero: 'PO-4519',
      transportistaId: transportistas[3].id, empresa: transportistas[3].empresa,
      origen: 'Irapuato', destino: 'Almacén 69',
      fechaProgramada: hoyMasDias(9), ventanaInicio: '10:00', ventanaFin: '12:00',
      dockId: null, estado: 'en_caseta', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      entrada: {
        operador: 'Sergio Vargas', placas: 'GTO-444-H',
        numeroCaja: 'CJ-908', sello: 'SL-5008', timestamp: iso(c19Entrada),
      },
    });
    addTransicion(c19Id, 'programada', subMinutes(now, 70));
    addTransicion(c19Id, 'en_caseta', c19Entrada);

    // 1 en_descarga, ventana 1h, semana actual, con nota
    const c20Id = uid();
    const c20Caseta = subMinutes(now, 35);
    const c20Descarga = subMinutes(now, 20);
    citasArr.push({
      id: c20Id, folio: folioPara(hoyMasDias(6), 1), poNumero: 'PO-4520',
      transportistaId: transportistas[4].id, empresa: transportistas[4].empresa,
      origen: 'San Luis Potosí', destino: 'Almacén 69',
      fechaProgramada: hoyMasDias(6), ventanaInicio: '09:00', ventanaFin: '10:00',
      dockId: docks[2].id, estado: 'en_descarga', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      entrada: {
        operador: 'Andrés Soto', placas: 'SLP-555-J',
        numeroCaja: 'CJ-909', sello: 'SL-5009', timestamp: iso(c20Caseta),
      },
      notas: 'Documentación adicional: certificado de calidad adjunto por correo',
    });
    addTransicion(c20Id, 'programada', subMinutes(now, 80));
    addTransicion(c20Id, 'en_caseta', c20Caseta);
    addTransicion(c20Id, 'en_descarga', c20Descarga);

    // 1 completada, ventana 2h, semana siguiente
    const c21Id = uid();
    const c21Caseta = subMinutes(now, 180);
    const c21Descarga = subMinutes(now, 150);
    const c21Completada = subMinutes(now, 100);
    citasArr.push({
      id: c21Id, folio: folioPara(hoyMasDias(7), 1), poNumero: 'PO-4521',
      transportistaId: transportistas[0].id, empresa: transportistas[0].empresa,
      origen: 'Aguascalientes', destino: 'Almacén 69',
      fechaProgramada: hoyMasDias(7), ventanaInicio: '08:00', ventanaFin: '10:00',
      dockId: docks[3].id, estado: 'completada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      entrada: {
        operador: 'Pedro Nava', placas: 'AGS-666-K',
        numeroCaja: 'CJ-910', sello: 'SL-5011', timestamp: iso(c21Caseta),
      },
      salida: {
        numeroCaja: 'CJ-910', sello: 'SL-5012', timestamp: iso(c21Completada),
      },
    });
    addTransicion(c21Id, 'programada', subMinutes(now, 220));
    addTransicion(c21Id, 'en_caseta', c21Caseta);
    addTransicion(c21Id, 'en_descarga', c21Descarga);
    addTransicion(c21Id, 'completada', c21Completada);

    // 1 cancelada, ventana 2h, semana siguiente, con nota
    const c22Id = uid();
    const c22Programada = subMinutes(now, 120);
    const c22Cancelada = subMinutes(now, 60);
    citasArr.push({
      id: c22Id, folio: folioPara(hoyMasDias(10), 1), poNumero: 'PO-4522',
      transportistaId: transportistas[1].id, empresa: transportistas[1].empresa,
      origen: 'CDMX', destino: 'Almacén 69',
      fechaProgramada: hoyMasDias(10), ventanaInicio: '11:00', ventanaFin: '13:00',
      dockId: null, estado: 'cancelada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      notas: 'Cancelada por el cliente',
    });
    addTransicion(c22Id, 'programada', c22Programada);
    addTransicion(c22Id, 'cancelada', c22Cancelada, 'Cancelada por el cliente');

    // 1 programada, ventana 3h, semana siguiente, con nota
    const c23Id = uid();
    citasArr.push({
      id: c23Id, folio: folioPara(hoyMasDias(11), 1), poNumero: 'PO-4523',
      transportistaId: transportistas[2].id, empresa: transportistas[2].empresa,
      origen: 'Monterrey', destino: 'Almacén 69',
      fechaProgramada: hoyMasDias(11), ventanaInicio: '06:00', ventanaFin: '09:00',
      dockId: null, estado: 'programada', plantaId: PLANTA_ID,
      creadoPorNombre: usuarios[0].nombre,
      notas: 'Requiere rampa con acceso para doble remolque',
    });
    addTransicion(c23Id, 'programada', subMinutes(now, 30));

    setCitas(citasArr);
    setTransiciones(transiciones);
    setDocks(docks);
    setTransportistas(transportistas);
    setUsuarios(usuarios);
  }, [citas.length, setCitas, setTransiciones, setDocks, setTransportistas, setUsuarios]);
}
