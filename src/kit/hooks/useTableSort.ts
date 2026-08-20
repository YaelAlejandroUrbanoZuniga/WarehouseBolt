import { useState, useMemo } from 'react';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type SortDir = 'asc' | 'desc' | null;
export type SortableValue = string | number | Date | null | undefined;

function isEmpty(v: SortableValue): boolean {
  return v === null || v === undefined || v === '';
}

function comparar(a: SortableValue, b: SortableValue, dir: 'asc' | 'desc'): number {
  const aEmpty = isEmpty(a);
  const bEmpty = isEmpty(b);
  if (aEmpty && bEmpty) return 0;
  if (aEmpty) return 1;
  if (bEmpty) return -1;

  let result: number;
  if (a instanceof Date && b instanceof Date) {
    result = a.getTime() - b.getTime();
  } else if (typeof a === 'number' && typeof b === 'number') {
    result = a - b;
  } else {
    result = String(a).localeCompare(String(b));
  }

  return dir === 'desc' ? -result : result;
}

export function sortIcon(
  field: string,
  sortField: string | null,
  sortDir: SortDir,
): { icon: IconDefinition; color: string } {
  if (field !== sortField || sortDir === null) {
    return { icon: faArrowUp, color: '#D1D3D4' };
  }
  return sortDir === 'asc'
    ? { icon: faArrowUp, color: '#000000' }
    : { icon: faArrowDown, color: '#000000' };
}

export function useTableSort<T>(
  rows: T[],
  getValue: (row: T, field: string) => SortableValue,
) {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const handleSort = (field: string) => {
    if (field !== sortField) {
      setSortField(field);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortField(null);
      setSortDir(null);
    }
  };

  const sortedRows = useMemo(() => {
    if (sortField === null || sortDir === null) return rows;
    return [...rows].sort((a, b) =>
      comparar(getValue(a, sortField), getValue(b, sortField), sortDir),
    );
  }, [rows, sortField, sortDir, getValue]);

  return { sortField, sortDir, handleSort, sortedRows };
}
