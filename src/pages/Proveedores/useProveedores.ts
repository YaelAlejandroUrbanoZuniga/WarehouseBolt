import { useAtom } from 'jotai';
import { proveedoresAtom } from '@/lib/store';
import type { Proveedor, ProveedorInput } from '@/lib/types';

type Resultado = { ok: true } | { ok: false; motivo: string };

export function useProveedores() {
  const [proveedores, setProveedores] = useAtom(proveedoresAtom);

  function crearProveedor(input: ProveedorInput): Resultado {
    const nombreNorm = input.nombre.trim().toLowerCase();
    const codigoNorm = input.codigo.trim().toLowerCase();

    if (proveedores.some(p => p.nombre.trim().toLowerCase() === nombreNorm)) {
      return { ok: false, motivo: 'Ya existe un proveedor con ese nombre.' };
    }
    if (proveedores.some(p => p.codigo.trim().toLowerCase() === codigoNorm)) {
      return { ok: false, motivo: 'Ya existe un proveedor con ese código.' };
    }

    const nuevo: Proveedor = {
      id: crypto.randomUUID(),
      nombre: input.nombre.trim(),
      codigo: input.codigo.trim(),
      origenPredeterminado: input.origenPredeterminado.trim(),
      contactoNombre: input.contactoNombre.trim(),
      contactoTelefono: input.contactoTelefono.trim(),
      contactoCorreo: input.contactoCorreo.trim(),
      lineaTransporteHabitual: input.lineaTransporteHabitual,
      activo: true,
      notas: input.notas?.trim() || undefined,
    };

    setProveedores([...proveedores, nuevo]);
    return { ok: true };
  }

  function editarProveedor(id: string, input: ProveedorInput): Resultado {
    const nombreNorm = input.nombre.trim().toLowerCase();
    const codigoNorm = input.codigo.trim().toLowerCase();

    if (proveedores.some(p => p.id !== id && p.nombre.trim().toLowerCase() === nombreNorm)) {
      return { ok: false, motivo: 'Ya existe un proveedor con ese nombre.' };
    }
    if (proveedores.some(p => p.id !== id && p.codigo.trim().toLowerCase() === codigoNorm)) {
      return { ok: false, motivo: 'Ya existe un proveedor con ese código.' };
    }

    setProveedores(proveedores.map(p => p.id === id ? {
      ...p,
      nombre: input.nombre.trim(),
      codigo: input.codigo.trim(),
      origenPredeterminado: input.origenPredeterminado.trim(),
      contactoNombre: input.contactoNombre.trim(),
      contactoTelefono: input.contactoTelefono.trim(),
      contactoCorreo: input.contactoCorreo.trim(),
      lineaTransporteHabitual: input.lineaTransporteHabitual,
      notas: input.notas?.trim() || undefined,
    } : p));
    return { ok: true };
  }

  function alternarActivo(id: string) {
    setProveedores(proveedores.map(p => p.id === id ? { ...p, activo: !p.activo } : p));
  }

  return { proveedores, crearProveedor, editarProveedor, alternarActivo };
}
