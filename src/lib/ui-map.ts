import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCalendarCheck, faDoorOpen, faTruckMoving, faBoxesPacking,
  faRightFromBracket, faClipboardCheck, faBan,
} from '@fortawesome/free-solid-svg-icons';
import { colores } from '@/kit/tokens/colores';
import type { EstadoCita } from './types';

export const ESTADO_UI: Record<EstadoCita, { icon: IconDefinition; color: string }> = {
  programada:      { icon: faCalendarCheck,    color: colores.libres.info },
  en_caseta:       { icon: faDoorOpen,         color: colores.libres.pendiente },
  en_planta:       { icon: faTruckMoving,      color: colores.libres.enPlanta },
  en_descarga:     { icon: faBoxesPacking,     color: colores.libres.descarga },
  saliendo:        { icon: faRightFromBracket,  color: colores.libres.saliendo },
  completada:      { icon: faClipboardCheck,    color: colores.libres.exito },
  cancelada:       { icon: faBan,              color: colores.libres.archivado },
};

export const COLOR_RETRASO = '#DC0202';
