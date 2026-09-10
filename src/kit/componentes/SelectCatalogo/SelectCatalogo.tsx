import type { CSSProperties } from 'react';
import { colores } from '@/kit/tokens/colores';

const ESTILO_SELECT: CSSProperties = {
  width: '100%', padding: '8px 12px', border: `1px solid ${colores.superficie.borde}`,
  borderRadius: 6, fontSize: 13, color: colores.texto.principal, outline: 'none',
  boxSizing: 'border-box', backgroundColor: colores.nucleo.superficie,
};

interface Props {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
  label?: string;
  obligatorio?: boolean;
  style?: CSSProperties;
}

export function SelectCatalogo({ value, onChange, options, placeholder = 'Seleccionar', label, obligatorio, style }: Props) {
  const estaEnCatalogo = value === '' || options.includes(value);
  return (
    <div>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: colores.texto.secundario, display: 'block', marginBottom: 4 }}>
          {label}
          {obligatorio && <span style={{ color: colores.nucleo.accion, marginLeft: 2 }}>*</span>}
        </label>
      )}
      <select value={value} onChange={e => onChange(e.target.value)} style={{ ...ESTILO_SELECT, ...style }}>
        <option value="">{placeholder}</option>
        {!estaEnCatalogo && <option value={value}>{value}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
