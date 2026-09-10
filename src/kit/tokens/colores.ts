/**
 * ============================================================================
 * COLOR — v6.1
 * ============================================================================
 * Este archivo tiene DOS tipos de entrada, y no se tratan igual:
 *
 * 1. `nucleo` — seis colores fijos. Nunca se sustituyen, aclaran ni oscurecen.
 *    Ver ESTANDAR_UI.md §3.1. Si el sistema es de otra marca, se sustituyen
 *    los seis, JUNTOS, una sola vez, aqui — nunca pantalla por pantalla.
 *
 * 2. `superficie` y `texto` — grises funcionales. No son de marca, pero SI
 *    estan fijados porque resuelven un problema real: sin ellos, cada
 *    pantalla elige un gris claro distinto y ninguno significa nada.
 *    Ver ESTANDAR_UI.md §3.4.
 *
 * Todo lo demas — estados, categorias, acentos, cualquier necesidad propia
 * del sistema — es LIBRE. Este archivo no lo restringe. La unica regla es de
 * REUTILIZACION, no de lista permitida:
 *
 *   Si un color ya cumple un rol en el sistema, se reutiliza ese color para
 *   cualquier otro elemento que cumpla el mismo rol. No se elige un tono
 *   parecido. Solo se introduce un tono distinto cuando el caso concreto
 *   necesita, de forma deliberada, un contraste que el color existente no da.
 *
 * Ver ESTANDAR_UI.md §3.2 para el detalle completo de esta regla.
 *
 * Opacidades: NUNCA se inventa un color mas claro a ojo. Se deriva del mismo
 * hex con sufijo hexadecimal de alfa:
 *   '1F' ~ 12%  -> fondo de circulo de icono, fila seleccionada
 *   '14' ~ 8%   -> fondo de hover de boton de texto
 *   '26' ~ 15%  -> fondo de badge / chip de estado
 * Ej: `backgroundColor: color + '1F'`.
 * ============================================================================
 */

export const colores = {
  /**
   * -- NUCLEO — los seis colores que nunca cambian ------------------------
   * Ver ESTANDAR_UI.md §3.1. Estos seis son el esqueleto visual que hace que
   * dos sistemas construidos bajo este estandar se reconozcan como parte de
   * la misma familia.
   */
  nucleo: {
    /** Header global, fondo lateral de login, boton de colapsar sidebar. */
    header: '#AA0202',
    /** Boton primario, badges de conteo, barra de item activo del sidebar,
     *  franja de panel lateral, pagina actual de paginacion, anillo del
     *  LoadingState, contorno de foco, subrayado de pestana activa. */
    accion: '#DC0202',
    /** Fondo de la barra lateral. Y ademas, todo el texto secundario del
     *  sistema: subtitulos, labels, texto de ayuda, celda secundaria de
     *  tabla, hora de notificacion. */
    sidebar: '#808285',
    /** Fondo de TODAS las pantallas, detras del contenido de cada modulo.
     *  Nunca blanco: el blanco es la superficie, este es el lienzo. */
    fondoApp: '#EEEEEE',
    /** Toda card, modal, panel, tabla, dropdown, toast. */
    superficie: '#FFFFFF',
    /** Titulos, valores, dato principal de tabla, texto de input. */
    textoPrincipal: '#000000',
  },

  /**
   * -- Grises funcionales de superficie ------------------------------------
   * No son de marca, pero SI son fijos: resuelven la superposicion de
   * superficies casi blancas (zebra, hover, separadores) que sin esto termina
   * con cinco valores puestos al azar. Regla practica: mas claro = mas al
   * fondo. No son intercambiables entre si.
   */
  superficie: {
    encabezadoTabla: '#F7F7F7', // SOLO el encabezado de tabla y las filas impares (zebra)
    hoverFila: '#F5F5F5',       // Hover de fila de lista, item de menu, boton secundario
    hoverCelda: '#EFEFEF',      // Hover de celda clicable dentro de una matriz / tabla pivote
    /** Separador entre items DENTRO de una card. Mas suave que el borde de
     *  tabla, que debe leerse a lo largo de una fila completa. */
    separadorInterno: '#F0F0F0',
    /** Zona de entrada hundida dentro de un panel (composer de nota,
     *  dropzone, fila de detalle expandida). Mas claro que hoverFila. */
    hundida: '#FAFAFA',
    borde: '#D1D3D4',        // Borde de input, boton secundario, flecha de orden inactiva
    bordeSuave: '#E0E0E0',   // Borde de busqueda/filtro, separador de fila, borde de dropdown
    scrollTrack: '#F1F1F1',
    scrollThumb: '#C1C1C1',
    scrollThumbHover: '#A1A1A1',
  },

  /**
   * -- Texto ----------------------------------------------------------------
   * `principal` y `secundario` son alias directos del nucleo (textoPrincipal
   * y sidebar) para que el codigo de texto se lea por su rol semantico.
   */
  texto: {
    principal: '#000000',   // = nucleo.textoPrincipal
    secundario: '#808285',  // = nucleo.sidebar
    formulario: '#484848',  // Labels y textos de apoyo DENTRO del formulario de login (unica pantalla con escala propia)
    leido: '#9CA3AF',       // Notificacion ya leida (mas apagado que el secundario)
    sobreOscuro: '#FFFFFF', // Texto sobre header rojo, sidebar gris, banda de modal
    sobreOscuroSuave: 'rgba(255,255,255,0.70)',      // Rol del usuario en el sidebar
    sobreOscuroSubtitulo: 'rgba(255,255,255,0.75)',  // Subtitulo dentro de ModalHeader
  },

  // -- Overlays y velos -----------------------------------------------------
  // Estructurales, no de marca: se quedan igual sea cual sea el sistema.
  overlay: {
    modal: 'rgba(0,0,0,0.3)',        // Detras de un modal centrado, con backdropFilter: 'blur(4px)'
    panelLateral: 'rgba(0,0,0,0.15)', // Detras de un panel lateral (mas suave)
  },

  /**
   * -- LIBRES ----------------------------------------------------------------
   * No es normativo. Es el conjunto de colores secundarios y terciarios que
   * DockFlow necesita para sus propios roles (estados de SLA, categorias,
   * links, acentos, y los tres estados de cita propios de DockFlow).
   *
   * Lo unico que no cambia es la LOGICA: una vez que un color queda asignado
   * a un rol (por ejemplo, "exito"), ese mismo hex se reutiliza para
   * cualquier otro elemento que sea "exito" en el sistema — nunca se elige un
   * verde parecido porque el elemento nuevo "se siente distinto".
   */
  libres: {
    /** Link interno, breadcrumb, accion de texto dentro de una card. */
    link: '#0084C0',
    /** Link que sale del sistema. Siempre subrayado. */
    linkExterno: '#02B3E1',

    /** Confirmado, completado, delta positivo. */
    exito: '#6ABF4B',
    /** En riesgo, esperando, error de validacion del usuario (toast ambar). */
    pendiente: '#D4A017',
    /** Advertencia fuerte, atencion requerida. */
    advertencia: '#E3650B',
    /** Informativo, en proceso. */
    info: '#02B3E1',
    /** Estado terminal, menor privilegio, deshabilitado. */
    archivado: '#6B7280',

    /** Riel del anillo de LoadingState. */
    loadingTrack: '#F3D6D6',
    /** Etiqueta / tag neutra dentro de una nota o comentario. */
    tagNeutro: '#475569',

    /** Estados de cita propios de DockFlow. Unico destino: tablero semanal
     *  de Citas y su leyenda — deben distinguirse de los otros cuatro
     *  estados de cita que ya usan colores de arriba (info, pendiente,
     *  exito, archivado). */
    enPlanta: '#7048E8',
    descarga: '#D6336C',
    saliendo: '#12B886',
  },
} as const;

/**
 * ============================================================================
 * CUSTOMIZACION PARA UN SISTEMA QUE NO SEA DE NEXTEER
 * ============================================================================
 * Cambiar SOLO los seis hex de `nucleo`, por la paleta de la marca
 * correspondiente — juntos, una sola vez, aqui.
 *
 * `superficie` y `texto` (salvo `principal`/`secundario`, que son alias del
 * nucleo) se quedan igual: son grises funcionales, no de marca.
 *
 * `libres` se reemplaza completo por los colores secundarios/terciarios que
 * el sistema nuevo necesite — no hay obligacion de conservar ninguno de
 * estos roles ni estos hex.
 */
