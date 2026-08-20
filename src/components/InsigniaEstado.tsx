import { ESTADOS } from '@/lib/constants';
import { ESTADO_UI } from '@/lib/ui-map';
import type { EstadoCita } from '@/lib/types';

interface Props {
  estado: EstadoCita;
}

export function InsigniaEstado({ estado }: Props) {
  const color = ESTADO_UI[estado].color;
  const nombre = ESTADOS[estado].nombre;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 600,
        color,
        backgroundColor: `${color}26`,
      }}
    >
      {nombre}
    </span>
  );
}
