/**
 * ============================================================================
 * TIPOGRAFIA OFICIAL NEXTEER UI - v6.1
 * ============================================================================
 * Fuente unica: Inter (Google Fonts o self-host). Se aplica con el selector
 * universal:  * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
 *
 * La jerarquia se logra SIEMPRE por tamano, peso y color. NUNCA se mezcla una
 * segunda tipografia, ni siquiera "solo para los numeros" o "solo para el
 * logo del sistema".
 * ============================================================================
 */

export const tipografia = {
  fontFamily: "'Inter', sans-serif",

  /**
   * Escala completa del sistema. "peso" es el font-weight numerico.
   * Cada entrada tiene UN destino. Si un texto nuevo no encaja en ninguna,
   * se usa la mas parecida - no se inventa un tamano intermedio.
   */
  escala: {
    // -- Pantalla ---------------------------------------------------------
    tituloPantalla:      { size: 32, peso: 700, color: '#000000' },
    subtituloPantalla:   { size: 16, peso: 400, color: '#808285' },
    /** Titulo de una card o de un bloque dentro de la pantalla. */
    tituloSeccion:       { size: 14, peso: 700, color: '#000000' },

    // -- KPI --------------------------------------------------------------
    kpiEtiqueta:         { size: 14, peso: 500, color: '#808285' },
    kpiNumero:           { size: 30, peso: 700, color: '#000000' },
    kpiSubtexto:         { size: 11, peso: 400, color: '#808285' },

    // -- Tabla ------------------------------------------------------------
    tablaEncabezado:      { size: 13, peso: 700, color: '#000000' },
    tablaCeldaPrincipal:  { size: 13, peso: 700, color: '#000000' },
    tablaCeldaSecundaria: { size: 13, peso: 400, color: '#808285' },
    /** Numero dentro de una celda de matriz pivote. */
    tablaCeldaNumerica:   { size: 13, peso: 600, color: '#000000' },
    /** Delta +n / -n al lado de un numero. Color segun signo. */
    tablaDelta:           { size: 12, peso: 700 },
    /** Folio, codigo, id: dato de apoyo dentro de una fila. */
    tablaMeta:            { size: 12, peso: 400, color: '#808285' },

    // -- Navegacion -------------------------------------------------------
    sidebarItem:         { size: 16, peso: 500 }, // color depende de activo/inactivo
    sidebarUsuario:      { size: 15, peso: 600, color: '#FFFFFF' },
    sidebarRol:          { size: 12, peso: 400, color: 'rgba(255,255,255,0.70)' },
    itemMenu:            { size: 13, peso: 400, color: '#000000' },
    /** Pestana de contenido. UN solo tamano en todo el sistema: 14.
     *  Activa peso 700 color #000000; inactiva peso 400 color #808285. */
    pestana:             { size: 14, peso: 400, color: '#808285' },
    pestanaActiva:       { size: 14, peso: 700, color: '#000000' },
    /** Migas de pan. El ultimo nivel va #000000 peso 600, sin link. */
    breadcrumb:          { size: 12, peso: 500, color: '#0084C0' },

    // -- Modales y paneles ------------------------------------------------
    modalTitulo:         { size: 20, peso: 700, color: '#FFFFFF', letterSpacing: '-0.01em' },
    modalSubtitulo:      { size: 13, peso: 400, color: 'rgba(255,255,255,0.75)' },
    modalCuerpo:         { size: 13, peso: 400, color: '#808285', lineHeight: 1.6 },
    panelTitulo:         { size: 15, peso: 700, color: '#FFFFFF' },
    panelPestana:        { size: 13, peso: 600 },

    // -- Estados ----------------------------------------------------------
    estadoTitulo:        { size: 15, peso: 700, color: '#000000' }, // LoadingState / EmptyState
    estadoDescripcion:   { size: 13, peso: 400, color: '#808285' },

    // -- Notificaciones y toasts ------------------------------------------
    notificacionTexto:   { size: 13, peso: 600, color: '#000000', lineHeight: 1.4 },
    notificacionHora:    { size: 12, peso: 400, color: '#808285' },
    toastTitulo:         { size: 13, peso: 700, color: '#000000', lineHeight: 1.4 },
    toastMensaje:        { size: 12, peso: 400, color: '#808285', lineHeight: 1.5 },

    // -- Botones y links --------------------------------------------------
    botonPrimario:       { size: 14, peso: 700, color: '#FFFFFF' },
    botonModal:          { size: 13, peso: 700, color: '#FFFFFF' },
    botonSecundario:     { size: 13, peso: 600, color: '#000000' },
    linkInterno:         { size: 13, peso: 500, color: '#0084C0' }, // sin subrayado en reposo
    linkExterno:         { size: 13, peso: 400, color: '#02B3E1' }, // subrayado siempre

    // -- Formularios ------------------------------------------------------
    inputTexto:          { size: 13, peso: 400, color: '#000000' },
    /** El label de formulario del sistema es 13/#808285 — NO confundir con
     *  loginLabel, que es 16/#484848 y vive solo en el login. */
    labelFormulario:     { size: 13, peso: 400, color: '#808285' },
    mensajeError:        { size: 12, peso: 400, color: '#DC0202' },
    /** Texto dentro de una insignia / chip de estado. */
    insignia:            { size: 11, peso: 500 },
    insigniaCompacta:    { size: 11, peso: 700 },

    // -- Login ------------------------------------------------------------
    loginCategoria:      { size: 13, peso: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.08em', textTransform: 'uppercase' },
    loginTitulo:         { size: 55, peso: 800, color: '#FFFFFF', lineHeight: 1.15, letterSpacing: '-0.02em' },
    loginDescripcion:    { size: 16, peso: 400, color: 'rgba(255,255,255,0.80)', lineHeight: 1.6 },
    loginBienvenida:     { size: 30, peso: 700, color: '#000000' },
    /** Label de campo DENTRO de la card de login. Deliberadamente mas grande
     *  que `labelFormulario`: es la unica pantalla sin header ni sidebar. */
    loginLabel:          { size: 16, peso: 500, color: '#484848' },
    loginBoton:          { size: 16, peso: 700, color: '#FFFFFF' },

    // -- Etiquetas pequenas ------------------------------------------------
    /** Titulo de un tooltip o de una seccion pequena. Va en MAYUSCULAS. */
    etiquetaSeccion:     { size: 12, peso: 700, color: '#808285', letterSpacing: '0.04em', textTransform: 'uppercase' },
    /** Nombre del sistema escrito en texto dentro del header (cuando no hay logo). */
    nombreSistemaHeader: { size: 22, peso: 700, color: '#FFFFFF', letterSpacing: '0.12em' },
  },
} as const;

/**
 * Si el sistema nuevo usa otra tipografia de marca, cambiar solo `fontFamily`.
 * La escala de tamanos y pesos se mantiene igual: es un patron de jerarquia
 * visual, no depende de que fuente se use.
 */
