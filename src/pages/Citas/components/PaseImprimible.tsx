import { QRCodeSVG } from 'qrcode.react';
import { colores } from '@/kit/tokens/colores';
import type { Cita } from '@/lib/types';

interface Props {
  cita: Cita;
}

export function PaseImprimible({ cita }: Props) {
  return (
    <div className="pase-imprimible">
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: colores.texto.principal }}>
          PASE DE ACCESO — PLANTA 69
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ display: 'inline-block', padding: 12, backgroundColor: colores.nucleo.superficie, border: `1px solid ${colores.superficie.bordeSuave}`, borderRadius: 8 }}>
          <QRCodeSVG value={cita.codigoAcceso} size={220} level="M" />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 700, letterSpacing: 2, color: colores.texto.principal }}>
          {cita.codigoAcceso}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', fontSize: 14, color: colores.texto.principal, maxWidth: 400, margin: '0 auto' }}>
        <InfoRow label="Folio" value={cita.folio} />
        <InfoRow label="Empresa" value={cita.empresa} />
        <InfoRow label="Fecha" value={cita.fechaProgramada} />
        <InfoRow label="Ventana" value={`${cita.ventanaInicio} - ${cita.ventanaFin}`} />
      </div>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <p style={{ fontSize: 11, color: colores.texto.secundario }}>
          Presente este pase en caseta el día y hora de su cita.
        </p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ color: colores.texto.secundario, fontWeight: 500 }}>{label}: </span>
      <span style={{ color: colores.texto.principal }}>{value}</span>
    </div>
  );
}
