import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCalendarCheck, faDoorOpen, faTruckMoving, faBoxesPacking,
  faRightFromBracket, faClipboardCheck, faBan,
} from '@fortawesome/free-solid-svg-icons';
import { colores } from '@/kit/tokens/colores';
import type { EstadoCita } from './types';

export const ESTADO_UI: Record<EstadoCita, { icon: IconDefinition; color: string }> = {
  programada:      { icon: faCalendarCheck,    color: colores.status.info },
  en_caseta:       { icon: faDoorOpen,         color: colores.status.pending },
  en_planta:       { icon: faTruckMoving,      color: colores.status.enPlanta },
  en_descarga:     { icon: faBoxesPacking,     color: colores.status.descarga },
  saliendo:        { icon: faRightFromBracket,  color: colores.status.saliendo },
  completada:      { icon: faClipboardCheck,    color: colores.status.active },
  cancelada:       { icon: faBan,              color: colores.status.archived },
};

export const COLOR_RETRASO = '#DC0202';
