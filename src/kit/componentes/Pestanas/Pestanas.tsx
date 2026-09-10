import { useState, type ReactNode } from 'react';
import { colores } from '@/kit/tokens/colores';

interface Tab {
  id: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  children: ReactNode;
}

export function Pestanas({ tabs, activeTab, onChange, children }: Props) {
  const [hoverTab, setHoverTab] = useState<string | null>(null);

  return (
    <div>
      <div style={{ display: 'flex', borderBottom: `1px solid ${colores.superficie.bordeSuave}` }}>
        {tabs.map(tab => {
          const isActive = tab.id === activeTab;
          const isHovered = tab.id === hoverTab;
          let textColor: string;
          if (isActive) textColor = colores.texto.principal;
          else if (isHovered) textColor = colores.texto.principal;
          else textColor = colores.texto.secundario;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              onMouseEnter={() => setHoverTab(tab.id)}
              onMouseLeave={() => setHoverTab(null)}
              style={{
                border: 'none',
                background: 'transparent',
                padding: '10px 16px',
                fontSize: 14,
                fontWeight: isActive ? 700 : 400,
                color: textColor,
                cursor: isActive ? 'default' : 'pointer',
                borderBottom: isActive ? `2px solid ${colores.nucleo.accion}` : '2px solid transparent',
                marginBottom: -1,
                transition: 'color 0.15s ease-out',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {children}
    </div>
  );
}
