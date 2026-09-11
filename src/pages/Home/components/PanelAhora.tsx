import { useState, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import { colores } from '@/kit/tokens/colores';
import { Tarjeta } from '@/kit/componentes/Tarjeta/Tarjeta';
import { EmptyState } from '@/kit/componentes/EmptyState/EmptyState';
import { ESTADO_UI } from '@/lib/ui-map';
import { ESTADOS } from '@/lib/constants';
import { rolActivoAtom } from '@/lib/store';
import type { PanelAhora as PanelAhoraData } from '../useHome';
import type { EstadoCita } from '@/lib/types';

interface FilaData {
  id: string;
  folio: string;
  empresa: string;
  estado: EstadoCita;
  minutos: number;
  contexto: string;
  color: string;
  esProxima: boolean;
}

function colorProxima(minFaltantes: number): string {
  if (minFaltantes < 0) return colores.nucleo.accion;
  if (minFaltantes <= 15) return colores.libres.pendiente;
  return colores.libres.info;
}

interface Props {
  data: PanelAhoraData;
}

export function PanelAhora({ data }: Props) {
  const rolActivo = useAtomValue(rolActivoAtom);
  const navigate = useNavigate();
  const puedeNavegar = rolActivo !== 'vigilancia';

  const filas = useMemo(() => {
    const resultado: FilaData[] = [];

    if (data.proximaCita) {
      const p = data.proximaCita;
      resultado.push({
        id: p.cita.id,
        folio: p.cita.folio,
        empresa: p.cita.empresa,
        estado: 'programada',
        minutos: Math.abs(p.minutosFaltantes),
        contexto: p.minutosFaltantes < 0 ? 'Cita atrasada' : 'Próxima cita',
        color: colorProxima(p.minutosFaltantes),
        esProxima: true,
      });
    }

    const rest: FilaData[] = [];

    for (const it of data.enDescarga) {
      rest.push({
        id: it.cita.id,
        folio: it.cita.folio,
        empresa: it.cita.empresa,
        estado: 'en_descarga',
        minutos: it.minutos,
        contexto: `Rampa ${it.rampa}`,
        color: ESTADO_UI.en_descarga.color,
        esProxima: false,
      });
    }

    for (const it of data.movimientos) {
      rest.push({
        id: it.cita.id,
        folio: it.cita.folio,
        empresa: it.cita.empresa,
        estado: it.cita.estado,
        minutos: it.minutosEnEstado,
        contexto: ESTADOS[it.cita.estado].nombre,
        color: ESTADO_UI[it.cita.estado].color,
        esProxima: false,
      });
    }

    rest.sort((a, b) => b.minutos - a.minutos);
    return [...resultado, ...rest];
  }, [data]);

  const vacio = filas.length === 0;

  return (
    <Tarjeta>
      <div className="flex items-center" style={{ gap: 8, marginBottom: 16 }}>
        <FontAwesomeIcon icon={faTruck} style={{ fontSize: 14, color: colores.nucleo.accion }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: colores.texto.principal }}>Ahora en patio</span>
      </div>

      {vacio ? (
        <EmptyState
          icon={faTruck}
          title="Patio vacío"
          description="No hay actividad en el patio en este momento."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filas.map(fila => (
            <FilaItem
              key={fila.id}
              fila={fila}
              clicable={puedeNavegar}
              onClick={() => { if (puedeNavegar) navigate(`/citas?cita=${fila.id}`); }}
            />
          ))}
        </div>
      )}
    </Tarjeta>
  );
}

function FilaItem({ fila, clicable, onClick }: { fila: FilaData; clicable: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const ui = ESTADO_UI[fila.estado];

  return (
    <div
      onClick={clicable ? onClick : undefined}
      onMouseEnter={() => { if (clicable) setHover(true); }}
      onMouseLeave={() => setHover(false)}
      className="flex items-center"
      style={{
        gap: 12,
        padding: '12px 14px',
        borderRadius: 8,
        backgroundColor: hover ? colores.superficie.hoverFila : `${fila.color}14`,
        cursor: clicable ? 'pointer' : 'default',
        transition: 'background-color 0.12s',
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          backgroundColor: `${fila.color}26`,
          flexShrink: 0,
        }}
      >
        <FontAwesomeIcon icon={ui.icon} style={{ fontSize: 16, color: fila.color }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colores.texto.principal }}>
          {fila.folio} — {fila.empresa}
        </div>
        <div style={{ fontSize: 12, color: colores.texto.secundario, marginTop: 2 }}>
          {fila.contexto}
        </div>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: fila.color }}>{fila.minutos}</span>
        <span style={{ fontSize: 11, fontWeight: 400, color: colores.texto.secundario, marginLeft: 3 }}>min</span>
      </div>
    </div>
  );
}
