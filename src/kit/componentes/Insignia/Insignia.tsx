import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  color: string;
  compacta?: boolean;
}

export function Insignia({ children, color, compacta = false }: Props) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: compacta ? '2px 8px' : '2px 7px',
      borderRadius: compacta ? 3 : 4,
      fontSize: 11,
      fontWeight: compacta ? 700 : 500,
      color,
      backgroundColor: `${color}26`,
    }}>
      {children}
    </span>
  );
}
