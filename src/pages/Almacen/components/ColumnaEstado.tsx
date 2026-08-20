import { type ReactNode } from 'react';
import { Tarjeta } from '@/kit/componentes/Tarjeta/Tarjeta';
import { EmptyState } from '@/kit/componentes/EmptyState/EmptyState';
import { faBoxesPacking } from '@fortawesome/free-solid-svg-icons';
import type { Cita } from '@/lib/types';

interface Props {
  titulo: string;
  citas: Cita[];
  renderCita: (cita: Cita) => ReactNode;
}

function calcTiempo(timestamp: string, ahora: Date): string {
  const diff = ahora.getTime() - new Date(timestamp).getTime();
  const totalMin = Math.max(0, Math.floor(diff / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m}m`;
}

export { calcTiempo };

export function ColumnaEstado({ titulo, citas, renderCita }: Props) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#000000', margin: 0 }}>
          {titulo}
        </h2>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#808285' }}>
          ({citas.length})
        </span>
      </div>
      {citas.length === 0 ? (
        <EmptyState
          icon={faBoxesPacking}
          title={`Sin citas en "${titulo}"`}
          description="No hay transportes en este estado."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {citas.map(cita => (
            <Tarjeta key={cita.id}>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#000000' }}>{cita.folio}</span>
              </div>
              <div style={{ fontSize: 13, color: '#808285', marginBottom: 4 }}>{cita.empresa}</div>
              <div style={{ fontSize: 13, color: '#808285', marginBottom: 4 }}>
                Placas: {cita.entrada?.placas ?? '—'}
              </div>
              {cita.entrada && (
                <div style={{ fontSize: 12, color: '#808285', marginBottom: 12 }}>
                  En patio: {calcTiempo(cita.entrada.timestamp, new Date())}
                </div>
              )}
              {renderCita(cita)}
            </Tarjeta>
          ))}
        </div>
      )}
    </div>
  );
}
