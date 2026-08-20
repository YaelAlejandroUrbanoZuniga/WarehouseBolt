import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { citasAtom, transicionesAtom, transportistasAtom, usuarioActivoAtom } from '@/lib/store';
import { PLANTA_ID, calcularSubEstado, TRANSICIONES_PERMITIDAS } from '@/lib/constants';
import type { Cita, CitaEditInput, CitaInput, TransicionEstado } from '@/lib/types';
import { getInicioSemana, getDiasSemana, addSemanas, generarFolio, hayTraslape } from './utils';

const NOTA_RETRASO = 'Retraso detectado automáticamente (30 min sin avance)';

export function useCitas() {
  const [citas, setCitas] = useAtom(citasAtom);
  const [transiciones, setTransiciones] = useAtom(transicionesAtom);
  const transportistas = useAtomValue(transportistasAtom);
  const usuarioActivo = useAtomValue(usuarioActivoAtom);

  const [semanaActual, setSemanaActual] = useState(() => getInicioSemana(new Date()));
  const [modalCita, setModalCita] = useState<Cita | null>(null);
  const [vistaExpandida, setVistaExpandida] = useState(false);
  const [ahora, setAhora] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setAhora(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const diasSemana = useMemo(() => getDiasSemana(semanaActual), [semanaActual]);

  const semanaAnterior = useCallback(() => {
    setSemanaActual(prev => addSemanas(prev, -1));
  }, []);

  const semanaSiguiente = useCallback(() => {
    setSemanaActual(prev => addSemanas(prev, 1));
  }, []);

  const citasConSubEstado = useMemo(() => {
    return citas.map(c => ({
      ...c,
      subEstado: calcularSubEstado(c, transiciones, ahora),
    }));
  }, [citas, transiciones, ahora]);

  const prevRetrasos = useRef<Set<string>>(new Set());
  useEffect(() => {
    const nuevosRetrasos: { citaId: string; estado: Cita['estado'] }[] = [];
    const currentRetrasos = new Set<string>();

    for (const cita of citasConSubEstado) {
      if (cita.subEstado !== 'retraso') continue;
      const key = `${cita.id}:${cita.estado}`;
      currentRetrasos.add(key);

      if (prevRetrasos.current.has(key)) continue;

      const yaRegistrado = transiciones.some(
        t => t.citaId === cita.id && t.estado === cita.estado && t.nota === NOTA_RETRASO,
      );
      if (!yaRegistrado) {
        nuevosRetrasos.push({ citaId: cita.id, estado: cita.estado });
      }
    }

    prevRetrasos.current = currentRetrasos;

    if (nuevosRetrasos.length > 0) {
      const nuevasTransiciones: TransicionEstado[] = nuevosRetrasos.map(r => ({
        id: crypto.randomUUID(),
        citaId: r.citaId,
        estado: r.estado,
        usuarioNombre: 'Sistema',
        timestamp: new Date().toISOString(),
        nota: NOTA_RETRASO,
      }));
      setTransiciones([...transiciones, ...nuevasTransiciones]);
    }
  }, [citasConSubEstado, transiciones, setTransiciones]);

  const crearCita = useCallback((input: CitaInput): { ok: true } | { ok: false; motivo: string } => {
    const conflicto = citas.some(c =>
      c.fechaProgramada === input.fechaProgramada &&
      c.estado !== 'cancelada' &&
      hayTraslape(input.ventanaInicio, input.ventanaFin, c.ventanaInicio, c.ventanaFin),
    );
    if (conflicto) {
      return { ok: false, motivo: 'El horario se traslapa con otra cita programada ese día.' };
    }

    const id = crypto.randomUUID();
    const ahoraISO = new Date().toISOString();
    const folio = generarFolio(citas);
    const transportistaId = input.transportistaId ?? '';
    const empresa = transportistas.find(t => t.id === transportistaId)?.empresa ?? '';

    const nueva: Cita = {
      id,
      folio,
      poNumero: input.poNumero,
      transportistaId,
      empresa,
      origen: input.origen,
      destino: input.destino,
      fechaProgramada: input.fechaProgramada,
      ventanaInicio: input.ventanaInicio,
      ventanaFin: input.ventanaFin,
      dockId: null,
      estado: 'programada',
      plantaId: PLANTA_ID,
      creadoPorNombre: usuarioActivo?.nombre ?? 'Sistema',
      notas: input.notas,
    };

    const transicion: TransicionEstado = {
      id: crypto.randomUUID(),
      citaId: id,
      estado: 'programada',
      usuarioNombre: usuarioActivo?.nombre ?? 'Sistema',
      timestamp: ahoraISO,
    };

    setCitas([...citas, nueva]);
    setTransiciones([...transiciones, transicion]);
    return { ok: true };
  }, [citas, transiciones, transportistas, usuarioActivo, setCitas, setTransiciones]);

  const editarCita = useCallback((citaId: string, input: CitaEditInput) => {
    setCitas(citas.map(c => c.id === citaId ? {
      ...c,
      poNumero: input.poNumero,
      empresa: input.empresa,
      origen: input.origen,
      destino: input.destino,
      notas: input.notas,
    } : c));
  }, [citas, setCitas]);

  const cancelarCita = useCallback((citaId: string) => {
    const cita = citas.find(c => c.id === citaId);
    if (!cita) return;
    const permitidos = TRANSICIONES_PERMITIDAS[cita.estado];
    if (!permitidos.includes('cancelada')) return;

    setCitas(citas.map(c => c.id === citaId ? { ...c, estado: 'cancelada' as const } : c));
    setTransiciones([...transiciones, {
      id: crypto.randomUUID(),
      citaId,
      estado: 'cancelada',
      usuarioNombre: usuarioActivo?.nombre ?? 'Sistema',
      timestamp: new Date().toISOString(),
    }]);
  }, [citas, transiciones, usuarioActivo, setCitas, setTransiciones]);

  const borrarCita = useCallback((citaId: string) => {
    const cita = citas.find(c => c.id === citaId);
    if (!cita || cita.estado !== 'cancelada') return;
    setCitas(citas.filter(c => c.id !== citaId));
    setTransiciones(transiciones.filter(t => t.citaId !== citaId));
  }, [citas, transiciones, setCitas, setTransiciones]);

  return {
    citas,
    citasConSubEstado,
    diasSemana,
    semanaActual,
    semanaAnterior,
    semanaSiguiente,
    modalCita,
    setModalCita,
    vistaExpandida,
    setVistaExpandida,
    crearCita,
    editarCita,
    cancelarCita,
    borrarCita,
    ahora,
  };
}
