export const colores = {
  nexteer: {
    red: '#DC0202', headerRed: '#AA0202', sidebar: '#808285',
    sidebarLine: '#6B7280', page: '#EEEEEE', border: '#E0E0E0',
    borderSoft: '#D1D3D4', link: '#0084C0', textSecondary: '#808285',
  },
  status: {
    active: '#6ABF4B', pending: '#D4A017', warning: '#E3650B',
    error: '#DC0202', info: '#02B3E1', archived: '#6B7280',
    descarga: '#D6336C',
    enPlanta: '#7048E8',
    saliendo: '#12B886',
  },
  superficie: {
    card: '#FFFFFF', encabezadoTabla: '#F7F7F7', hoverFila: '#F5F5F5',
    hoverCelda: '#EFEFEF', scrollTrack: '#F1F1F1', scrollThumb: '#C1C1C1',
    scrollThumbHover: '#A1A1A1',
  },
  texto: {
    principal: '#000000', secundario: '#808285', formulario: '#484848',
    leido: '#9CA3AF', sobreOscuro: '#FFFFFF',
    sobreOscuroSuave: 'rgba(255,255,255,0.70)',
    sobreOscuroSubtitulo: 'rgba(255,255,255,0.75)',
  },
  decorativo: { loadingTrack: '#F3D6D6', tagNeutro: '#475569' },
  overlay: {
    modal: 'rgba(0,0,0,0.3)', panelLateral: 'rgba(0,0,0,0.15)',
    loginTinte: '#AA0202', loginTinteOpacidad: 0.8,
  },
} as const;

export const coloresProhibidos = {
  '#6366F1': 'Indigo. Sustituto correcto: #0084C0.',
  '#FF0000': 'Rojo genérico. El rojo de marca es #DC0202.',
  '#F44336': 'Rojo de Material Design. Usar #DC0202.',
  '#CC0000': 'Rojo viejo del proyecto. Usar #DC0202.',
  '#3B82F6': 'Azul default de Tailwind. Usar #0084C0 o #02B3E1.',
  '#10B981': 'Verde default de Tailwind. Usar #6ABF4B.',
} as const;
