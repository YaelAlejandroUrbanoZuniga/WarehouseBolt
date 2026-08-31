import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { colores } from '@/kit/tokens/colores';

interface Props {
  variante?: 'oscuro' | 'claro';
  mostrarFecha?: boolean;
}

export function RelojActual({ variante = 'claro', mostrarFecha = true }: Props) {
  const [ahora, setAhora] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const colorHora = variante === 'oscuro' ? colores.texto.sobreOscuro : colores.texto.principal;
  const colorFecha = variante === 'oscuro' ? colores.texto.sobreOscuroSuave : colores.texto.secundario;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
      <span style={{ fontSize: 16, fontWeight: 600, color: colorHora, fontVariantNumeric: 'tabular-nums' }}>
        {format(ahora, 'HH:mm:ss')}
      </span>
      {mostrarFecha && (
        <span style={{ fontSize: 12, fontWeight: 400, color: colorFecha }}>
          {format(ahora, 'EEE d MMM', { locale: es })}
        </span>
      )}
    </div>
  );
}
