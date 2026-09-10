/**
 * ============================================================================
 * GEOMETRIA DEL LAYOUT - FUENTE UNICA DE VERDAD
 * ============================================================================
 * Todo elemento que se posicione respecto al header, al sidebar o al area de
 * contenido DEBE importar de aqui. Prohibido escribir el numero a mano.
 * ============================================================================
 */

/**
 * Alto del header global fijo. VALOR OFICIAL: 55px.
 * Se subio a 55px de forma INTENCIONAL porque el overlay del panel de
 * notificaciones invadia 11px del propio header al abrirse.
 */
export const HEADER_HEIGHT = 55;

/** Ancho del sidebar expandido. */
export const SIDEBAR_WIDTH = 240;

/**
 * Ancho del sidebar colapsado. 60px, NO 56 ni 64.
 * El `marginLeft` del `<main>` debe leer esta misma constante.
 */
export const SIDEBAR_WIDTH_COLLAPSED = 60;

/**
 * Padding propio del `<main>` (el area gris de contenido).
 * `MAIN_PADDING_TOP` incluye el alto del header porque el header es `fixed`.
 */
export const MAIN_PADDING_TOP = HEADER_HEIGHT + 32; // 87
export const MAIN_PADDING_X = 32;
export const MAIN_PADDING_BOTTOM = 32;

/**
 * Alto real y visible del area de contenido.
 */
export const CONTENT_HEIGHT_CSS =
  `calc(100vh - ${MAIN_PADDING_TOP}px - ${MAIN_PADDING_BOTTOM}px)`;

/** Ancho maximo del panel de notificaciones (su ancho base es 25vw). */
export const NOTIFICATION_PANEL_MAX_WIDTH = 420;
/** Ancho minimo del panel de notificaciones. */
export const NOTIFICATION_PANEL_MIN_WIDTH = 300;
/** Alto del panel de notificaciones y de cualquier panel lateral colgado del header. */
export const SIDE_PANEL_HEIGHT = '75vh';

/**
 * Ancho minimo soportado por la aplicacion. Es una app de escritorio: NO esta
 * disenada para mobile ni tablet y no se le agregan breakpoints de telefono.
 * Lo que si debe soportar es zoom del navegador y laptops de 1280px.
 */
export const ANCHO_MINIMO = 1280;

/**
 * ============================================================================
 * ESCALA DE Z-INDEX - una sola escala para todo el sistema
 * ============================================================================
 * Prohibido inventar un z-index nuevo o usar 9999.
 */
export const zIndex = {
  sidebar: 30,
  header: 50,
  /** Menu desplegable del usuario, dentro del sidebar. */
  dropdown: 50,
  /** Velo detras de un panel lateral. */
  panelOverlay: 98,
  /** Panel lateral (notificaciones, notas). Siempre 1 arriba de su velo. */
  panel: 99,
  /** Overlay de carga a pantalla completa. */
  loadingFullScreen: 200,
  /** Tooltip flotante que sigue al cursor. */
  tooltip: 300,
  /** Modal centrado + su velo. */
  modal: 10001,
  /** Toasts. Deliberadamente por encima del modal. */
  toast: 10002,
} as const;
