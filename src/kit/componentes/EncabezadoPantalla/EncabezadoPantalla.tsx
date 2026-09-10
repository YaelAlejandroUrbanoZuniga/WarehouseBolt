import type { ReactNode } from 'react';
import { colores } from '@/kit/tokens/colores';

interface Props {
  titulo: string;
  subtitulo?: string;
  acciones?: ReactNode;
}

export function EncabezadoPantalla({ titulo, subtitulo, acciones }: Props) {
  return (
    <div className="flex items-end justify-between" style={{ marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: colores.texto.principal, margin: 0, lineHeight: 1.1 }}>
          {titulo}
        </h1>
        {subtitulo && (
          <p style={{ fontSize: 16, fontWeight: 400, color: colores.texto.secundario, margin: '4px 0 0' }}>
            {subtitulo}
          </p>
        )}
      </div>
      {acciones && (
        <div className="flex items-center" style={{ gap: 8 }}>
          {acciones}
        </div>
      )}
    </div>
  );
}
