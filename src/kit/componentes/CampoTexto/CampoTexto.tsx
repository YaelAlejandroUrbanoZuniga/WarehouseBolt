import type { InputHTMLAttributes } from 'react';
import { colores } from '@/kit/tokens/colores';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  obligatorio?: boolean;
}

export function CampoTexto({ label, error, obligatorio, style, ...resto }: Props) {
  return (
    <div>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: colores.texto.secundario, display: 'block', marginBottom: 4 }}>
          {label}
          {obligatorio && <span style={{ color: colores.nucleo.accion, marginLeft: 2 }}>*</span>}
        </label>
      )}
      <input
        style={{
          width: '100%', padding: '8px 12px',
          border: `1px solid ${error ? colores.nucleo.accion : colores.superficie.borde}`,
          borderRadius: 6, fontSize: 13, color: colores.texto.principal,
          outline: 'none', boxSizing: 'border-box', ...style,
        }}
        {...resto}
      />
      {error && <p style={{ fontSize: 12, color: colores.nucleo.accion, margin: '4px 0 0' }}>{error}</p>}
    </div>
  );
}
