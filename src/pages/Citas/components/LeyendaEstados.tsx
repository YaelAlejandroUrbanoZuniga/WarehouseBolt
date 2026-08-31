import { ESTADO_UI, COLOR_RETRASO } from '@/lib/ui-map';
import { ESTADOS, FLUJO_PRINCIPAL } from '@/lib/constants';
import { colores } from '@/kit/tokens/colores';
import type { EstadoCita } from '@/lib/types';

const LEYENDA: EstadoCita[] = [...FLUJO_PRINCIPAL, 'cancelada'];

export function LeyendaEstados() {
  return (
    <div className="flex" style={{ flexWrap: 'wrap', gap: 14, marginTop: 10, flexShrink: 0 }}>
      {LEYENDA.map(e => (
        <div key={e} className="flex items-center" style={{ gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: ESTADO_UI[e].color }} />
          <span style={{ fontSize: 11, color: colores.texto.secundario }}>{ESTADOS[e].nombre}</span>
        </div>
      ))}
      <div className="flex items-center" style={{ gap: 6 }}>
        <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: COLOR_RETRASO }} />
        <span style={{ fontSize: 11, color: colores.texto.secundario }}>Retraso</span>
      </div>
    </div>
  );
}
