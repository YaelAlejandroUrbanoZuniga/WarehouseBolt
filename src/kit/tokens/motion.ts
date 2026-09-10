/**
 * ============================================================================
 * MOVIMIENTO Y ANIMACION
 * ============================================================================
 * REGLA OBLIGATORIA: toda animacion declarada aqui se apaga bajo
 * `@media (prefers-reduced-motion: reduce)`. La implementacion vive en
 * `index.css`.
 * ============================================================================
 */

/** Duraciones. Tres niveles, no mas. */
export const duracion = {
  /** 120ms - hover de boton, icono, cambio de color de fondo. */
  rapida: 120,
  /** 200ms - entrada/salida de modal, toast, overlay, fade de pagina. */
  media: 200,
  /** 300ms - colapsar/expandir el sidebar y el desplazamiento del <main>. */
  lenta: 300,
} as const;

/** Curvas. `ease-out` para entrar, `ease-in` para salir. Sin excepciones. */
export const curva = {
  entrada: 'ease-out',
  salida: 'ease-in',
  continua: 'linear', // solo para el giro infinito del LoadingState
} as const;

/** Transiciones ya armadas, listas para pegar en `style`. */
export const transiciones = {
  hoverFondo: 'background-color 120ms ease-out',
  hoverSombra: 'box-shadow 150ms ease-out',
  hoverElevacion: 'transform 150ms ease-out, box-shadow 150ms ease-out',
  sidebar: 'width 300ms ease-out',
  contenido: 'margin-left 300ms ease-out',
} as const;

/**
 * Nombres de las clases de animacion definidas en index.css.
 * Se aplican con `className`, no con `style`, porque son @keyframes.
 */
export const clasesAnimacion = {
  /** Velo de modal. Agregar ' is-closing' para la salida. */
  modalOverlay: 'modal-overlay',
  /** Panel de modal. Agregar ' is-closing' para la salida. */
  modalPanel: 'modal-panel',
  /** Toast. Entra deslizando desde la derecha. */
  toast: 'toast-item',
  /** Fade de cambio de pagina. Se aplica al contenedor de rutas. */
  paginaFade: 'page-fade',
} as const;

/** Milisegundos que hay que esperar antes de desmontar un modal/toast que
 *  esta reproduciendo su animacion de salida. DEBE coincidir con la duracion
 *  declarada en index.css para `.is-closing`. */
export const EXIT_MS = duracion.media; // 200
