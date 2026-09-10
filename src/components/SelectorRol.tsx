import { useState } from 'react';
import { useAtom } from 'jotai';
import { rolActivoAtom } from '@/lib/store';
import { ROLES, ROL_ETIQUETA } from '@/lib/constants';
import { colores } from '@/kit/tokens/colores';
import type { Rol } from '@/lib/types';

export function SelectorRol() {
  const [rolActivo, setRolActivo] = useAtom(rolActivoAtom);
  const [hoverRol, setHoverRol] = useState<Rol | null>(null);

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {ROLES.map(rol => {
        const activo = rol === rolActivo;
        const hover = rol === hoverRol && !activo;
        return (
          <button
            key={rol}
            onClick={() => setRolActivo(rol)}
            onMouseEnter={() => setHoverRol(rol)}
            onMouseLeave={() => setHoverRol(null)}
            style={{
              fontSize: 13, borderRadius: 6, padding: '6px 14px', cursor: 'pointer',
              transition: 'background-color 120ms ease-out',
              backgroundColor: activo ? colores.nucleo.superficie : hover ? 'rgba(255,255,255,0.15)' : 'transparent',
              color: activo ? colores.nucleo.header : colores.texto.sobreOscuro,
              fontWeight: activo ? 700 : 500,
              border: activo ? 'none' : '1px solid rgba(255,255,255,0.4)',
            }}
          >
            {ROL_ETIQUETA[rol]}
          </button>
        );
      })}
    </div>
  );
}
