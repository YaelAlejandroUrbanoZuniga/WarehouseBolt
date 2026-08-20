import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { EmptyState } from '@/kit/componentes/EmptyState/EmptyState';
import { ESTADOS } from '@/lib/constants';
import { ESTADO_UI } from '@/lib/ui-map';
import type { Cita, TransicionEstado } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { calcularPuntualidad, colorPuntualidad } from '../utils';

interface Props {
  transiciones: TransicionEstado[];
  cita?: Cita;
}

export function LineaTiempo({ transiciones, cita }: Props) {
  if (transiciones.length === 0) {
    return (
      <EmptyState
        icon={faClockRotateLeft}
        title="Sin historial"
        description="Esta cita no tiene transiciones registradas."
      />
    );
  }

  const ordenadas = [...transiciones].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  const cronologicas = [...ordenadas].reverse();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {ordenadas.map((t, i) => {
        const cronIdx = cronologicas.findIndex(c => c.id === t.id);
        const anterior = cronIdx > 0 ? cronologicas[cronIdx - 1] : null;
        const puntualidad = cita
          ? calcularPuntualidad(t, anterior, cita)
          : (t.nota?.includes('Retraso detectado automáticamente') ? 'tarde' : 'a_tiempo');
        const color = t.estado === 'cancelada'
          ? ESTADO_UI[t.estado].color
          : colorPuntualidad(puntualidad);
        const nombreEstado = ESTADOS[t.estado].nombre;
        const esUltimo = i === ordenadas.length - 1;
        return (
          <div key={t.id} style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', backgroundColor: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 2,
              }}>
                <FontAwesomeIcon icon={ESTADO_UI[t.estado].icon} style={{ fontSize: 12, color: '#FFFFFF' }} />
              </div>
              {!esUltimo && (
                <div style={{
                  width: 2, flex: 1, backgroundColor: '#E0E0E0', minHeight: 28,
                }} />
              )}
            </div>
            <div style={{ paddingBottom: esUltimo ? 0 : 20, paddingTop: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#000000' }}>{nombreEstado}</div>
              <div style={{ fontSize: 12, fontWeight: 400, color: '#808285' }}>
                {t.usuarioNombre} · {format(new Date(t.timestamp), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
              </div>
              {t.nota && (
                <div style={{ fontSize: 12, color: '#808285', marginTop: 2 }}>{t.nota}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
