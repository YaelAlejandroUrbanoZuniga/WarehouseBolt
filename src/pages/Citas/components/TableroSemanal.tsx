import { useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { franjaIndex, getFranjasMediaHora } from '../utils';
import { CeldaCita } from './CeldaCita';
import { LineaHoraActual } from './LineaHoraActual';
import type { Cita } from '@/lib/types';

const NOMBRES_DIA = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const ALTURA_HEADER_DIAS = 36;
const ROW_HEIGHT_MIN = 18;

interface CitaPosicionada {
  cita: Cita;
  diaIdx: number;
  franjaInicio: number;
  span: number;
}

interface Props {
  citas: Cita[];
  diasSemana: Date[];
  onCitaClick: (cita: Cita) => void;
  alturaDisponible: number;
  ahora: Date;
}

export function TableroSemanal({ citas, diasSemana, onCitaClick, alturaDisponible, ahora }: Props) {
  const franjas = useMemo(() => getFranjasMediaHora(), []);

  const rowHeightRaw = Math.floor((alturaDisponible - ALTURA_HEADER_DIAS) / 48);
  const needsScroll = rowHeightRaw < ROW_HEIGHT_MIN;
  const rowHeight = Math.max(ROW_HEIGHT_MIN, rowHeightRaw);

  const citasPosicionadas = useMemo((): CitaPosicionada[] => {
    const resultado: CitaPosicionada[] = [];
    for (const cita of citas) {
      const diaIdx = diasSemana.findIndex(
        d => format(d, 'yyyy-MM-dd') === cita.fechaProgramada,
      );
      if (diaIdx === -1) continue;

      const inicio = franjaIndex(cita.ventanaInicio);
      const fin = franjaIndex(cita.ventanaFin);
      const span = Math.max(1, fin > inicio ? fin - inicio : (48 - inicio) + fin);
      resultado.push({ cita, diaIdx, franjaInicio: inicio, span });
    }
    return resultado;
  }, [citas, diasSemana]);

  const containerStyle: React.CSSProperties = needsScroll
    ? { flex: 1, overflowY: 'auto' }
    : { flex: 1 };

  return (
    <div style={{ ...containerStyle, position: 'relative' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '56px repeat(7, 1fr)',
          gridTemplateRows: `${ALTURA_HEADER_DIAS}px repeat(48, ${rowHeight}px)`,
          minWidth: 900,
        }}
      >
        {/* Header: top-left corner */}
        <div style={{ gridColumn: 1, gridRow: 1, position: 'sticky', top: 0, zIndex: 2, backgroundColor: '#F7F7F7' }} />

        {/* Header: day names */}
        {diasSemana.map((dia, i) => (
          <div
            key={`hdr-${i}`}
            style={{
              gridColumn: i + 2,
              gridRow: 1,
              position: 'sticky',
              top: 0,
              zIndex: 2,
              backgroundColor: '#F7F7F7',
              borderBottom: '1px solid #E0E0E0',
              padding: '8px 4px',
              textAlign: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {NOMBRES_DIA[i]} {format(dia, 'd', { locale: es })}
          </div>
        ))}

        {/* Background grid cells: hours column */}
        {franjas.map((franja, fIdx) => {
          const esHora = fIdx % 2 === 0;
          return (
            <div
              key={`hora-${fIdx}`}
              style={{
                gridColumn: 1,
                gridRow: fIdx + 2,
                height: rowHeight,
                borderBottom: '1px solid #F0F0F0',
                padding: '0 4px',
                fontSize: 11,
                color: '#808285',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                backgroundColor: '#FFFFFF',
              }}
            >
              {esHora ? franja : ''}
            </div>
          );
        })}

        {/* Background grid cells: day columns */}
        {franjas.map((_, fIdx) => (
          diasSemana.map((__, dIdx) => (
            <div
              key={`bg-${dIdx}-${fIdx}`}
              style={{
                gridColumn: dIdx + 2,
                gridRow: fIdx + 2,
                borderBottom: '1px solid #F0F0F0',
                borderLeft: '1px solid #F0F0F0',
                backgroundColor: '#FFFFFF',
              }}
            />
          ))
        ))}

        {/* Appointment cards */}
        {citasPosicionadas.map(({ cita, diaIdx, franjaInicio, span }) => (
          <CeldaCita
            key={cita.id}
            cita={cita}
            onCitaClick={onCitaClick}
            gridColumn={diaIdx + 2}
            gridRow={`${franjaInicio + 2} / span ${span}`}
            spanFranjas={span}
          />
        ))}
      </div>

      <LineaHoraActual
        ahora={ahora}
        diasSemana={diasSemana}
        rowHeight={rowHeight}
        headerHeight={ALTURA_HEADER_DIAS}
      />
    </div>
  );
}
