import { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faPrint } from '@fortawesome/free-solid-svg-icons';
import { QRCodeSVG } from 'qrcode.react';
import { colores } from '@/kit/tokens/colores';
import { Boton } from '@/kit/componentes/Boton/Boton';
import { PaseImprimible } from './PaseImprimible';
import type { Cita } from '@/lib/types';

interface Props {
  cita: Cita;
}

export function PanelAccesoCita({ cita }: Props) {
  const [copiado, setCopiado] = useState(false);

  const copiarCodigo = useCallback(() => {
    navigator.clipboard.writeText(cita.codigoAcceso).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }, [cita.codigoAcceso]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ marginBottom: 4 }}>
        <div style={{ fontSize: 12, color: colores.texto.secundario, marginBottom: 4 }}>Código de acceso</div>
        <div className="flex items-center" style={{ gap: 12 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: colores.texto.principal, letterSpacing: 1 }}>
            {cita.codigoAcceso}
          </span>
          <Boton variante="secundario" onClick={copiarCodigo}>
            <FontAwesomeIcon icon={faCopy} style={{ fontSize: 12, marginRight: 6 }} />
            {copiado ? 'Copiado' : 'Copiar'}
          </Boton>
        </div>
        <p style={{ fontSize: 12, color: colores.texto.secundario, margin: '6px 0 0' }}>
          Compártelo al transportista. Lo presentará en caseta el día de la cita.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ padding: 12, backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 8 }}>
          <QRCodeSVG value={cita.codigoAcceso} size={140} level="M" />
        </div>
        <Boton variante="secundario" onClick={() => window.print()}>
          <FontAwesomeIcon icon={faPrint} style={{ fontSize: 12, marginRight: 6 }} />
          Imprimir pase
        </Boton>
      </div>

      <div className="pase-imprimible-wrapper" style={{ display: 'none' }}>
        <PaseImprimible cita={cita} />
      </div>
    </div>
  );
}
