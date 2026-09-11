import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { colores } from '@/kit/tokens/colores';
import { Tarjeta } from '@/kit/componentes/Tarjeta/Tarjeta';
import { EmptyState } from '@/kit/componentes/EmptyState/EmptyState';
import { ESTADO_UI } from '@/lib/ui-map';
import { ESTADOS } from '@/lib/constants';
import type { ActividadReciente } from '../useHome';

interface Props {
  actividadReciente: ActividadReciente[];
}

function textoMovimiento(folio: string, rolEtiqueta: string, estado: string, esProgramada: boolean): string {
  if (esProgramada) return `${folio} — ${rolEtiqueta} creó la cita`;
  return `${folio} — ${rolEtiqueta} movió a ${ESTADOS[estado as keyof typeof ESTADOS]?.nombre ?? estado}`;
}

export function CardActividadReciente({ actividadReciente }: Props) {
  return (
    <Tarjeta>
      <div className="flex items-center" style={{ gap: 8, marginBottom: 16 }}>
        <FontAwesomeIcon icon={faClockRotateLeft} style={{ fontSize: 14, color: colores.libres.link }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: colores.texto.principal }}>Actividad reciente</span>
      </div>

      {actividadReciente.length === 0 ? (
        <EmptyState
          icon={faListCheck}
          title="Sin actividad"
          description="No hay transiciones registradas."
        />
      ) : (
        <div>
          {actividadReciente.map(({ transicion, folio, rolEtiqueta }, i) => {
            const isLast = i === actividadReciente.length - 1;
            const ui = ESTADO_UI[transicion.estado];

            return (
              <div
                key={transicion.id}
                className="flex items-start"
                style={{
                  gap: 12,
                  padding: '12px 4px',
                  borderBottom: isLast ? 'none' : `1px solid ${colores.superficie.bordeSuave}`,
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: `${ui.color}26`,
                    flexShrink: 0,
                  }}
                >
                  <FontAwesomeIcon icon={ui.icon} style={{ fontSize: 14, color: ui.color }} />
                </div>

                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: colores.texto.principal }}>
                    {textoMovimiento(folio, rolEtiqueta, transicion.estado, transicion.estado === 'programada')}
                  </div>
                  <div style={{ fontSize: 12, color: colores.texto.secundario, marginTop: 2 }}>
                    {format(new Date(transicion.timestamp), 'd MMM, HH:mm', { locale: es })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Tarjeta>
  );
}
