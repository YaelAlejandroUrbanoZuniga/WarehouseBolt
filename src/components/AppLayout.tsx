import { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { faGauge, faCalendarDays, faDoorOpen, faBoxesPacking } from '@fortawesome/free-solid-svg-icons';
import { GlobalHeader } from '@/kit/componentes/GlobalHeader/GlobalHeader';
import { Sidebar } from '@/kit/componentes/Sidebar/Sidebar';
import type { SidebarNavItem } from '@/kit/componentes/Sidebar/Sidebar';
import {
  MAIN_PADDING_TOP, MAIN_PADDING_X, MAIN_PADDING_BOTTOM,
  SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED,
} from '@/kit/tokens/layout';
import { rolActivoAtom, usuarioActivoAtom } from '@/lib/store';
import { ROL_ETIQUETA } from '@/lib/constants';
import type { Rol } from '@/lib/types';
import { SelectorRol } from './SelectorRol';

interface NavItemConRoles extends SidebarNavItem {
  roles: Rol[];
}

const NAV_ITEMS: NavItemConRoles[] = [
  { path: '/',        icon: faGauge,        label: 'Tablero',  roles: ['coordinador', 'vigilancia', 'almacen'] },
  { path: '/citas',   icon: faCalendarDays, label: 'Citas',    roles: ['coordinador', 'almacen'] },
  { path: '/caseta',  icon: faDoorOpen,     label: 'Caseta',   roles: ['vigilancia'] },
  { path: '/almacen', icon: faBoxesPacking, label: 'Almacén',  roles: ['almacen'] },
];

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const rolActivo = useAtomValue(rolActivoAtom);
  const usuarioActivo = useAtomValue(usuarioActivoAtom);
  const location = useLocation();
  const navigate = useNavigate();

  const itemsFiltrados = useMemo(
    () => NAV_ITEMS.filter(it => it.roles.includes(rolActivo)),
    [rolActivo],
  );

  useEffect(() => {
    const rutaPermitida = itemsFiltrados.some(
      it => location.pathname === it.path || location.pathname.startsWith(it.path + '/'),
    );
    if (!rutaPermitida) navigate('/');
  }, [rolActivo, itemsFiltrados, location.pathname, navigate]);

  const usuario = useMemo(() => ({
    displayName: usuarioActivo?.nombre ?? 'Usuario',
    role: ROL_ETIQUETA[rolActivo],
  }), [usuarioActivo, rolActivo]);

  return (
    <>
      <GlobalHeader titulo="DOCKFLOW" derecha={<SelectorRol />} />
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        items={itemsFiltrados}
        usuario={usuario}
        onCerrarSesion={() => {}}
      />
      <main style={{
        backgroundColor: '#EEEEEE', minHeight: '100vh',
        paddingTop: MAIN_PADDING_TOP, paddingLeft: MAIN_PADDING_X,
        paddingRight: MAIN_PADDING_X, paddingBottom: MAIN_PADDING_BOTTOM,
        marginLeft: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH,
        transition: 'margin-left 300ms ease-out',
      }}>
        <div className="page-fade" key={location.pathname}>
          <Outlet />
        </div>
      </main>
    </>
  );
}
