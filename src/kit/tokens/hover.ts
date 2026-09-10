import type { CSSProperties } from 'react';

/**
 * Utilidad de hover estándar — CUALQUIER elemento clickeable (botón, card,
 * fila, link) debe usar este patrón para que sea obvio que es interactivo.
 *
 * REGLA DEL ESTANDAR (ESTANDAR_UI.md §6.5): "La card no se mueve al hacer
 * hover. Sube la sombra, no el elemento." Un translateY en una grilla de 30
 * cards hace que la página parezca temblar al recorrerla con el mouse — por
 * eso `hoverElevadoProps` NO desplaza nada, solo sube la sombra.
 *
 * Uso:
 *   <div {...hoverElevadoProps} onClick={...}>...</div>
 *
 * O manual, si el componente ya tiene sus propios onMouseEnter/Leave:
 *   onMouseEnter={e => Object.assign(e.currentTarget.style, hoverElevadoEstilo)}
 *   onMouseLeave={e => Object.assign(e.currentTarget.style, hoverElevadoEstiloReposo)}
 */

export const hoverElevadoEstiloBase: CSSProperties = {
  transition: 'box-shadow 150ms ease-out',
  cursor: 'pointer',
};

export const hoverElevadoProps = {
  style: hoverElevadoEstiloBase,
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.13)';
  },
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
  },
};

/** Variante para ítems de lista/fila — cambia el fondo en vez de la sombra. Es
 *  el patrón correcto para filas de tabla, ítems de menú y botones secundarios,
 *  donde no hay una "card" que elevar. */
export const hoverFondoProps = {
  style: { transition: 'background-color 0.12s', cursor: 'pointer' } as CSSProperties,
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.backgroundColor = '#F5F5F5'; },
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.backgroundColor = 'transparent'; },
};
