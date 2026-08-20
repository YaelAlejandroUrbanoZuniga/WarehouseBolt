import type { ReactNode } from 'react';
import { HEADER_HEIGHT, zIndex } from '@/kit/tokens/layout';

interface Props {
  titulo: string;
  derecha?: ReactNode;
}

export function GlobalHeader({ titulo, derecha }: Props) {
  return (
    <header
      className="fixed top-0 left-0 right-0 flex items-center justify-between"
      style={{
        height: HEADER_HEIGHT, backgroundColor: '#AA0202',
        paddingLeft: 24, paddingRight: 24, zIndex: zIndex.header,
      }}
    >
      <span style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.12em' }}>
        {titulo}
      </span>
      {derecha}
    </header>
  );
}
