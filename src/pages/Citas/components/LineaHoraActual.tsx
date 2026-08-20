import { format } from 'date-fns';
import { colores } from '@/kit/tokens/colores';

interface Props {
  ahora: Date;
  diasSemana: Date[];
  rowHeight: number;
  headerHeight: number;
}

export function LineaHoraActual({ ahora, diasSemana, rowHeight, headerHeight }: Props) {
  const hoyStr = format(ahora, 'yyyy-MM-dd');
  const diaIdx = diasSemana.findIndex(d => format(d, 'yyyy-MM-dd') === hoyStr);

  if (diaIdx === -1) return null;

  const horas = ahora.getHours();
  const minutos = ahora.getMinutes();
  const franjaFraccional = (horas * 60 + minutos) / 30;
  const topPx = headerHeight + franjaFraccional * rowHeight;

  const horaLabel = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;

  return (
    <div
      style={{
        position: 'absolute',
        top: topPx,
        left: 0,
        right: 0,
        pointerEvents: 'none',
        zIndex: 5,
        display: 'grid',
        gridTemplateColumns: '56px repeat(7, 1fr)',
      }}
    >
      {/* Empty time column slot */}
      <div />

      {/* Line spanning only today's column */}
      {diasSemana.map((_, i) => {
        if (i !== diaIdx) return <div key={i} />;
        return (
          <div key={i} className="flex items-center" style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translate(calc(-100% - 8px), -50%)',
                fontSize: 10,
                fontWeight: 700,
                color: colores.status.error,
                backgroundColor: '#FFFFFF',
                padding: '1px 4px',
                borderRadius: 3,
                whiteSpace: 'nowrap',
              }}
            >
              {horaLabel}
            </span>
            <div
              style={{
                position: 'absolute',
                left: 0,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: colores.status.error,
                transform: 'translate(-50%, -50%)',
                top: '50%',
              }}
            />
            <div
              style={{
                width: '100%',
                height: 2,
                backgroundColor: colores.status.error,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
