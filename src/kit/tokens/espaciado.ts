/**
 * ============================================================================
 * ESPACIADO, SOMBRAS Y BORDES - v6.1
 * ============================================================================
 */

/**
 * Todo el espaciado (padding, gap, margin) usa multiplos de 4px.
 * Fuera de esta escala solo se sale por una razon estructural documentada
 * (ej. `padding: '15px 15px'` en el item del sidebar, que existe para que el
 * item mida exactamente 48px de alto con el icono de 18px adentro).
 */
export const espaciado = [4, 8, 12, 16, 20, 24, 28, 32] as const;

/**
 * Paddings de referencia por tipo de contenedor.
 */
export const padding = {
  card: 20,                     // TarjetaKPI, Tarjeta
  cardVacia: '48px 24px',       // EmptyState - respira mas porque esta vacia
  modalCuerpo: '28px 32px',     // cuerpo de un modal, debajo de la banda
  modalBanda: '20px 32px',      // ModalHeader
  panelBanda: '12px 16px',      // franja de titulo de un panel lateral
  panelBarraInferior: '8px 12px',
  filaTablaEncabezado: '12px 16px',
  filaTablaCelda: '10px 16px',
  filaLista: '14px 16px',
  itemMenu: '10px 16px',
  botonPrimario: '8px 16px',
  toast: '12px 14px',
  tooltip: 12,
} as const;

/**
 * ============================================================================
 * GAPS POR CONTEXTO
 * ============================================================================
 * La regla que los genera todos: el gap crece con la independencia semantica
 * de los elementos. Icono y texto de un boton son UNA cosa (6). Dos botones
 * son DOS cosas (8). Dos bloques de la pantalla son dos regiones (24).
 */
export const gap = {
  iconoTextoBoton: 6,
  iconoTextoTitulo: 8,
  iconoTextoSidebar: 10,   // compensa la caja fija de 40px del icono
  iconoTextoMenu: 12,
  iconoTextoAviso: 10,     // toast y fila de notificacion
  entreBotones: 8,
  entreBotonesModal: 12,   // Cancelar y Confirmar deben ser dificiles de confundir
  entreChips: 6,
  entreCamposFormulario: 16,
  entreColumnasFormulario: 12,
  entreCamposFiltro: 12,
  entreCards: 20,
  entreCardsKPI: 16,
  entreBloquesPantalla: 24,
  entreToasts: 10,
  etiquetaControl: 4,
} as const;

/** Sombras - progresivas: a mayor interaccion, mayor sombra. */
export const sombras = {
  card: '0 1px 4px rgba(0,0,0,0.08)',        // reposo
  cardHover: '0 4px 12px rgba(0,0,0,0.13)',  // hover de card
  selectable: '0 2px 6px rgba(0,0,0,0.10)',  // elemento seleccionable
  btnHover: '0 6px 16px rgba(0,0,0,0.18)',   // hover de boton primario
  dropdown: '0 8px 24px rgba(0,0,0,0.20)',   // modal / dropdown / tooltip / toast
  panelLateral: '-4px 0 24px rgba(0,0,0,0.20)', // panel anclado al borde derecho
  botonFlotante: '0 2px 6px rgba(0,0,0,0.28)',  // boton circular de colapsar sidebar
} as const;

/** Border-radius - un valor por TIPO de componente, no por pantalla. */
export const bordeRadio = {
  card: 8,
  boton: 8,
  input: 6,
  botonSecundario: 6,  // Cancelar, limpiar filtros, boton de accion en EmptyState
  insignia: 4,         // badges / chips de estado - SIEMPRE 4px, nunca pill
  /** UNICA forma pildora permitida: el badge NUMERICO de conteo pegado a un
   *  trigger (el "3" del boton de filtros, el contador de la campana). */
  badgeConteo: 999,
  paginacion: 4,
  panelFiltros: 10,
  modal: 12,
  dropdown: 8,
  tooltip: 8,
  toast: 8,
} as const;

/** Anchos fijos de elementos flotantes. */
export const anchos = {
  modalConfirmacion: 420,
  modalFormulario: 560,
  /** Unico ancho extra permitido: formulario de 2 columnas o con una tabla
   *  adentro. Un modal mas ancho que esto deberia ser una pantalla. */
  modalFormularioAncho: 720,
  panelFiltros: 320,
  panelLateralCompleto: 380,
  tooltip: 320,
  tooltipAltoMaximo: 240,
  toast: 380,
  menuUsuario: 180,
} as const;

/** Duraciones de transicion - ver tambien tokens/motion.ts. */
export const transiciones = {
  rapida: '120ms',
  media: '200ms',
  lenta: '300ms',
} as const;

/** Ancho minimo soportado. Ver tokens/layout.ts (ANCHO_MINIMO). */
export const anchoMinimo = 1280;
