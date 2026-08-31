import { useState } from 'react';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { Boton } from '@/kit/componentes/Boton/Boton';
import { TablaDatos } from '@/kit/componentes/TablaDatos/TablaDatos';
import { Insignia } from '@/kit/componentes/Insignia/Insignia';
import { EmptyState } from '@/kit/componentes/EmptyState/EmptyState';
import { LoadingState } from '@/kit/componentes/LoadingState/LoadingState';
import { ConfirmDialog } from '@/kit/componentes/ConfirmDialog/ConfirmDialog';
import { PLANTA_NOMBRE } from '@/lib/constants';
import type { Proveedor } from '@/lib/types';
import { useProveedores } from './useProveedores';
import { PanelProveedor } from './components/PanelProveedor';

export default function ProveedoresPage() {
  const { proveedores, crearProveedor, editarProveedor, alternarActivo } = useProveedores();
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [editando, setEditando] = useState<Proveedor | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<Proveedor | null>(null);
  const [cargando] = useState(false);

  if (cargando) return <LoadingState mensaje="Cargando proveedores..." />;

  const columnas = [
    { key: 'nombre', label: 'Nombre', sortable: true, width: '1.4fr' },
    { key: 'codigo', label: 'Código', sortable: true, width: '0.8fr' },
    { key: 'origenPredeterminado', label: 'Origen', width: '1fr' },
    { key: 'contactoNombre', label: 'Contacto', width: '1fr' },
    { key: 'lineaTransporteHabitual', label: 'Línea de transporte', width: '1.2fr' },
    {
      key: 'activo', label: 'Estado', width: '0.7fr',
      render: (row: Record<string, unknown>) => (
        <Insignia estado={row.activo ? 'active' : 'archived'}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </Insignia>
      ),
    },
    {
      key: '_acciones', label: 'Acciones', width: '1fr',
      render: (row: Record<string, unknown>) => {
        const prov = row as unknown as Proveedor;
        return (
          <div className="flex items-center" style={{ gap: 8 }}>
            <Boton variante="secundario" onClick={() => setEditando(prov)}>Editar</Boton>
            <Boton variante="secundario" onClick={() => setConfirmToggle(prov)}>
              {prov.activo ? 'Desactivar' : 'Activar'}
            </Boton>
          </div>
        );
      },
    },
  ];

  const filas = proveedores as unknown as Record<string, unknown>[];

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#000000', margin: 0 }}>Proveedores</h1>
          <p style={{ fontSize: 16, fontWeight: 400, color: '#808285', margin: '4px 0 0' }}>
            {PLANTA_NOMBRE}
          </p>
        </div>
        <Boton onClick={() => setPanelAbierto(true)}>Nuevo proveedor</Boton>
      </div>

      {proveedores.length === 0 ? (
        <EmptyState
          icon={faBuilding}
          title="Sin proveedores registrados"
          description="Todavía no hay proveedores en el sistema."
        />
      ) : (
        <TablaDatos columnas={columnas} filas={filas} />
      )}

      {panelAbierto && (
        <PanelProveedor
          onClose={() => setPanelAbierto(false)}
          onGuardar={input => {
            const r = crearProveedor(input);
            if (r.ok) setPanelAbierto(false);
            return r;
          }}
        />
      )}

      {editando && (
        <PanelProveedor
          proveedor={editando}
          onClose={() => setEditando(null)}
          onGuardar={input => {
            const r = editarProveedor(editando.id, input);
            if (r.ok) setEditando(null);
            return r;
          }}
        />
      )}

      {confirmToggle && (
        <ConfirmDialog
          title={confirmToggle.activo ? 'Desactivar proveedor' : 'Activar proveedor'}
          message={confirmToggle.activo
            ? `Se desactivará "${confirmToggle.nombre}". No se eliminará del sistema.`
            : `Se reactivará "${confirmToggle.nombre}".`
          }
          confirmLabel={confirmToggle.activo ? 'Desactivar' : 'Activar'}
          onCancel={() => setConfirmToggle(null)}
          onConfirm={() => {
            alternarActivo(confirmToggle.id);
            setConfirmToggle(null);
          }}
        />
      )}
    </div>
  );
}
