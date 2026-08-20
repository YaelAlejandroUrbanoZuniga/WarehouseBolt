import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { ESTADO_UI, COLOR_RETRASO } from '@/lib/ui-map';
import type { Cita } from '@/lib/types';

interface Props {
  cita: Cita;
  onCitaClick: (cita: Cita) => void;
  gridColumn: number;
  gridRow: string;
  spanFranjas: number;
}

export function CeldaCita({ cita, onCitaClick, gridColumn, gridRow, spanFranjas }: Props) {
  const [hover, setHover] = useState(false);

  const esRetraso = cita.subEstado === 'retraso';
  const colorBase = esRetraso ? COLOR_RETRASO : ESTADO_UI[cita.estado].color;
  const bgColor = esRetraso ? COLOR_RETRASO : `${colorBase}26`;
  const bgHover = esRetraso ? COLOR_RETRASO : `${colorBase}3D`;
  const textColor = esRetraso ? '#FFFFFF' : '#000000';
  const iconColor = esRetraso ? '#FFFFFF' : COLOR_RETRASO;

  const multiLinea = spanFranjas > 1;

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onCitaClick(cita); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        gridColumn,
        gridRow,
        backgroundColor: hover ? bgHover : bgColor,
        borderLeft: `3px solid ${colorBase}`,
        borderRadius: 4,
        padding: '3px 6px',
        margin: '1px 2px',
        cursor: 'pointer',
        overflow: 'hidden',
        whiteSpace: multiLinea ? 'normal' : 'nowrap',
        textOverflow: multiLinea ? undefined : 'ellipsis',
        fontSize: 11,
        fontWeight: 600,
        color: textColor,
        lineHeight: '18px',
        transition: 'background-color 0.15s ease-out',
        zIndex: 1,
        display: multiLinea ? '-webkit-box' : undefined,
        WebkitLineClamp: multiLinea ? 2 : undefined,
        WebkitBoxOrient: multiLinea ? 'vertical' : undefined,
      }}
    >
      {esRetraso && (
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          className="retraso-parpadeo"
          style={{ color: iconColor, fontSize: 10, marginRight: 3 }}
        />
      )}
      {cita.folio} — {cita.empresa}
    </div>
  );
}
