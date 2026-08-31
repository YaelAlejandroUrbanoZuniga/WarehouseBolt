import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { HEADER_HEIGHT, SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED, zIndex } from '@/kit/tokens/layout';

export interface SidebarNavItem {
  path: string;
  icon: IconDefinition;
  label: string;
}

interface AccionExtra {
  label: string;
  icon: IconDefinition;
  onClick: () => void;
}

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  items: SidebarNavItem[];
  usuario: { displayName: string; role: string };
  onCerrarSesion: () => void;
  accionesExtra?: AccionExtra[];
}

function getIniciales(name: string): string {
  const palabras = name.trim().split(/\s+/);
  return palabras.slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('');
}

export function Sidebar({ collapsed, onToggle, items, usuario, onCerrarSesion, accionesExtra }: Props) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [hoverItem, setHoverItem] = useState<string | null>(null);
  const [toggleHover, setToggleHover] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuAbierto) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node)) return;
      if (triggerRef.current?.contains(e.target as Node)) return;
      setMenuAbierto(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuAbierto]);

  return (
    <aside
      className="fixed left-0 flex flex-col"
      style={{
        width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH,
        backgroundColor: '#808285', top: HEADER_HEIGHT, bottom: 0,
        zIndex: zIndex.sidebar, transition: 'width 0.3s',
      }}
    >
      <button
        onClick={onToggle}
        onMouseEnter={() => setToggleHover(true)}
        onMouseLeave={() => setToggleHover(false)}
        style={{
          position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)',
          width: 30, height: 30, borderRadius: '50%',
          backgroundColor: toggleHover ? '#DC0202' : '#AA0202',
          color: '#FFFFFF', border: 'none',
          boxShadow: '0 2px 6px rgba(0,0,0,0.28)', zIndex: 10, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} style={{ fontSize: 10 }} />
      </button>

      <nav style={{ flex: 1, overflowY: 'auto', paddingTop: 8 }}>
        {items.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            onMouseEnter={() => setHoverItem(item.path)}
            onMouseLeave={() => setHoverItem(null)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '15px 15px', minHeight: 40,
              boxSizing: 'border-box', textDecoration: 'none',
              color: isActive ? '#000000' : '#FFFFFF',
              backgroundColor: isActive
                ? '#EEEEEE'
                : hoverItem === item.path
                  ? 'rgba(255,255,255,0.10)'
                  : 'transparent',
              boxShadow: isActive ? 'inset 6px 0 0 #DC0202' : 'none',
            })}
          >
            <FontAwesomeIcon icon={item.icon} style={{ fontSize: 18, width: 40, textAlign: 'center' }} />
            {!collapsed && (
              <span style={{ fontSize: 16, fontWeight: 500, whiteSpace: 'nowrap' }}>{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{ position: 'relative', backgroundColor: '#6B7280', padding: '12px 10px' }}>
        <div
          ref={triggerRef}
          onClick={() => setMenuAbierto(!menuAbierto)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '50%', backgroundColor: '#DC0202',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#FFFFFF', flexShrink: 0,
          }}>
            {getIniciales(usuario.displayName)}
          </div>
          {!collapsed && (
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF', margin: 0, whiteSpace: 'nowrap' }}>
                {usuario.displayName}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.70)', margin: 0 }}>
                {usuario.role}
              </p>
            </div>
          )}
        </div>

        {menuAbierto && (
          <MenuUsuario
            ref={menuRef}
            accionesExtra={accionesExtra}
            onCerrarSesion={() => { setMenuAbierto(false); onCerrarSesion(); }}
            onClose={() => setMenuAbierto(false)}
          />
        )}
      </div>
    </aside>
  );
}

import { forwardRef } from 'react';

interface MenuProps {
  accionesExtra?: AccionExtra[];
  onCerrarSesion: () => void;
  onClose: () => void;
}

const MenuUsuario = forwardRef<HTMLDivElement, MenuProps>(
  ({ accionesExtra, onCerrarSesion, onClose }, ref) => {
    const [hoverIdx, setHoverIdx] = useState<number | null>(null);

    const acciones: { label: string; icon: IconDefinition; onClick: () => void; color?: string }[] = [
      ...(accionesExtra ?? []),
      { label: 'Cerrar sesión', icon: faSignOutAlt, onClick: onCerrarSesion, color: '#DC0202' },
    ];

    return (
      <div
        ref={ref}
        style={{
          position: 'absolute', bottom: '100%', left: 8, marginBottom: 8,
          borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.20)',
          backgroundColor: '#FFFFFF', minWidth: 180, overflow: 'hidden', zIndex: 10,
        }}
      >
        {acciones.map((a, i) => (
          <button
            key={i}
            onClick={() => { a.onClick(); onClose(); }}
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '10px 16px', border: 'none',
              backgroundColor: hoverIdx === i ? '#F5F5F5' : '#FFFFFF',
              cursor: 'pointer', fontSize: 13, fontWeight: 500,
              color: a.color ?? '#000000', textAlign: 'left',
            }}
          >
            <FontAwesomeIcon icon={a.icon} style={{ fontSize: 13, width: 16 }} />
            {a.label}
          </button>
        ))}
      </div>
    );
  },
);
