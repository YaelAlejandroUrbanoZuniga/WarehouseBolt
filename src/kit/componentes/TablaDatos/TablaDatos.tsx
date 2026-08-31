import { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTableSort, sortIcon } from '@/kit/hooks/useTableSort';
import type { SortableValue } from '@/kit/hooks/useTableSort';

interface Columna {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: Record<string, unknown>) => React.ReactNode;
  width?: string;
}

interface Props {
  columnas: Columna[];
  filas: Record<string, unknown>[];
  getValorOrdenable?: (row: Record<string, unknown>, field: string) => SortableValue;
  mensajeVacio?: string;
}

export function TablaDatos({
  columnas, filas,
  getValorOrdenable,
  mensajeVacio = 'No se encontraron resultados.',
}: Props) {
  const getValue = useCallback(
    (row: Record<string, unknown>, field: string): SortableValue => {
      if (getValorOrdenable) return getValorOrdenable(row, field);
      const v = row[field];
      if (v instanceof Date || typeof v === 'number' || typeof v === 'string') return v;
      if (v === null || v === undefined) return null;
      return String(v);
    },
    [getValorOrdenable],
  );

  const { sortField, sortDir, handleSort, sortedRows } = useTableSort(filas, getValue);

  const gridTemplateColumns = columnas.map(c => c.width ?? '1fr').join(' ');

  return (
    <div style={{
      backgroundColor: '#FFFFFF', borderRadius: 8,
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns,
        padding: '12px 20px', backgroundColor: '#F7F7F7',
        borderBottom: '1px solid #E0E0E0',
      }}>
        {columnas.map(col => {
          const si = sortIcon(col.key, sortField, sortDir);
          return (
            <button
              key={col.key}
              onClick={col.sortable ? () => handleSort(col.key) : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: 'none', padding: 0,
                cursor: col.sortable ? 'pointer' : 'default',
                userSelect: 'none', fontSize: 12, fontWeight: 700,
                color: '#000000', textTransform: 'uppercase', letterSpacing: '0.04em',
              }}
            >
              {col.label}
              {col.sortable && (
                <FontAwesomeIcon icon={si.icon} style={{ fontSize: 10, color: si.color }} />
              )}
            </button>
          );
        })}
      </div>

      {sortedRows.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: '#808285', fontSize: 14 }}>
          {mensajeVacio}
        </div>
      ) : (
        sortedRows.map((fila, idx) => (
          <div
            key={idx}
            style={{
              display: 'grid', gridTemplateColumns,
              padding: '14px 20px', alignItems: 'center',
              backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F7F7F7',
              borderBottom: '1px solid #E0E0E0', fontSize: 13, color: '#000000',
            }}
          >
            {columnas.map(col => (
              <div key={col.key}>
                {col.render ? col.render(fila) : String(fila[col.key] ?? '')}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
