import { atom } from 'jotai';
import type { Cita, TransicionEstado, Dock, Transportista, Usuario, Rol } from './types';
import { ESQUEMA_VERSION } from './constants';

const SUFFIX = `-v${ESQUEMA_VERSION}`;

(function limpiarEsquemaAnterior() {
  const n = localStorage.length;
  const aBorrar: string[] = [];
  for (let i = 0; i < n; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('df-')) continue;
    if (key === 'df-rol') continue;
    if (!key.endsWith(SUFFIX)) aBorrar.push(key);
  }
  for (const key of aBorrar) localStorage.removeItem(key);
})();

function makeAtom<T>(key: string, fallback: T) {
  let initial: T;
  try {
    const raw = localStorage.getItem(key);
    initial = raw ? JSON.parse(raw) : fallback;
  } catch {
    initial = fallback;
  }

  const base = atom(initial);

  return atom(
    (get) => get(base),
    (_get, set, next: T) => {
      set(base, next);
      localStorage.setItem(key, JSON.stringify(next));
    },
  );
}

export const citasAtom = makeAtom<Cita[]>(`df-citas${SUFFIX}`, []);
export const transicionesAtom = makeAtom<TransicionEstado[]>(`df-transiciones${SUFFIX}`, []);
export const docksAtom = makeAtom<Dock[]>(`df-docks${SUFFIX}`, []);
export const transportistasAtom = makeAtom<Transportista[]>(`df-transportistas${SUFFIX}`, []);
export const usuariosAtom = makeAtom<Usuario[]>(`df-usuarios${SUFFIX}`, []);
export const rolActivoAtom = makeAtom<Rol>('df-rol', 'coordinador');

export const usuarioActivoAtom = atom((get) => {
  const rol = get(rolActivoAtom);
  const usuarios = get(usuariosAtom);
  return usuarios.find(u => u.rol === rol) ?? null;
});
