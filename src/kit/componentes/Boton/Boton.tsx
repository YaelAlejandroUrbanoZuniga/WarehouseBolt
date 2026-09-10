import { useState, type ReactNode, type ButtonHTMLAttributes } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { colores } from '@/kit/tokens/colores';
import { prefersReducedMotion } from '@/kit/hooks/useModalTransition';

type Variante = 'primario' | 'secundario' | 'terciario' | 'destructivo';
type Contexto = 'toolbar' | 'modal';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variante?: Variante;
  contexto?: Contexto;
  cargando?: boolean;
}

function getRadius(variante: Variante, contexto: Contexto): number {
  if (variante === 'secundario') return 6;
  if (variante === 'terciario') return 4;
  return contexto === 'modal' ? 6 : 8;
}

export function Boton({
  children,
  variante = 'primario',
  contexto = 'toolbar',
  cargando = false,
  disabled,
  style,
  ...resto
}: Props) {
  const [hovered, setHovered] = useState(false);
  const off = disabled || cargando;
  const reduced = prefersReducedMotion();
  const radius = getRadius(variante, contexto);

  let fondo: string;
  let texto: string;
  let borde: string | undefined;
  let hoverBg: string | undefined;
  let hoverShadow: string | undefined;

  switch (variante) {
    case 'primario':
    case 'destructivo':
      fondo = colores.nucleo.accion;
      texto = colores.texto.sobreOscuro;
      hoverShadow = '0 6px 16px rgba(0,0,0,0.18)';
      break;
    case 'secundario':
      fondo = colores.nucleo.superficie;
      texto = colores.texto.principal;
      borde = `1px solid ${colores.superficie.borde}`;
      hoverBg = colores.superficie.encabezadoTabla;
      break;
    case 'terciario':
      fondo = 'transparent';
      texto = colores.nucleo.accion;
      hoverBg = colores.nucleo.accion + '14';
      break;
  }

  const fontSize = variante === 'primario' || variante === 'destructivo' ? 14 : 13;
  const fontWeight = variante === 'primario' || variante === 'destructivo' ? 700 : 600;
  const padding = variante === 'terciario' ? '6px 10px' : '8px 16px';

  const activeBg = !off && hovered && hoverBg ? hoverBg : fondo;
  const activeShadow = !off && hovered && hoverShadow ? hoverShadow : 'none';

  return (
    <button
      disabled={off}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding,
        fontSize,
        fontWeight,
        borderRadius: radius,
        border: borde ?? 'none',
        backgroundColor: activeBg,
        color: texto,
        cursor: off ? 'not-allowed' : 'pointer',
        opacity: off ? 0.45 : 1,
        boxShadow: activeShadow,
        transition: reduced ? 'none' : 'background-color 0.15s ease-out, box-shadow 0.15s ease-out',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        ...style,
      }}
      {...resto}
    >
      {cargando && <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: 13 }} />}
      {children}
    </button>
  );
}
