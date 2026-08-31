import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { colores } from '@/kit/tokens/colores';
import { Tarjeta } from '@/kit/componentes/Tarjeta/Tarjeta';
import { InsigniaEstado } from '@/components/InsigniaEstado';
import { rolActivoAtom } from '@/lib/store';
import { formatMinutos } from '@/lib/tiempo';
import type { PanelAhora as PanelAhoraData } from '../useHome';

interface Props {
  data: PanelAhoraData;
}

export function PanelAhora({ data }: Props) {
  const rolActivo = useAtomValue(rolActivoAtom);
  const navigate = useNavigate();
  const puedeNavegar = rolActivo !== 'vigilancia';

  function irACita(citaId: string) {
    if (!puedeNavegar) return;
    navigate(`/citas?cita=${citaId}`);
  }

  return (
    <Tarjeta>
      <div style={{ fontSize: 16, fontWeight: 700, color: colores.texto.principal, marginBottom: 16 }}>
        Ahora en patio
      </div>
      <div className="grid grid-cols-3" style={{ gap: 20 }}>
        <ColumnaDescarga items={data.enDescarga} puedeNavegar={puedeNavegar} onClic={irACita} />
        <div style={{ borderLeft: `1px solid ${colores.nexteer.border}`, paddingLeft: 20 }}>
          <ColumnaProxima item={data.proximaCita} puedeNavegar={puedeNavegar} onClic={irACita} />
        </div>
        <div style={{ borderLeft: `1px solid ${colores.nexteer.border}`, paddingLeft: 20 }}>
          <ColumnaMovimientos items={data.movimientos} puedeNavegar={puedeNavegar} onClic={irACita} />
        </div>
      </div>
    </Tarjeta>
  );
}

function ColumnaDescarga({ items, puedeNavegar, onClic }: {
  items: PanelAhoraData['enDescarga']; puedeNavegar: boolean; onClic: (id: string) => void;
}) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: colores.texto.secundario, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        En descarga
      </div>
      {items.length === 0 ? (
        <p style={{ fontSize: 13, color: colores.texto.secundario, margin: 0 }}>Sin descargas en curso</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(it => (
            <Fila key={it.cita.id} clicable={puedeNavegar} onClick={() => onClic(it.cita.id)}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: colores.texto.principal }}>{it.cita.folio}</div>
                <div style={{ fontSize: 12, color: colores.texto.secundario }}>{it.cita.empresa}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: colores.texto.principal }}>{it.rampa}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: colores.status.pending }}>{formatMinutos(it.minutos)}</div>
              </div>
            </Fila>
          ))}
        </div>
      )}
    </div>
  );
}

function ColumnaProxima({ item, puedeNavegar, onClic }: {
  item: PanelAhoraData['proximaCita']; puedeNavegar: boolean; onClic: (id: string) => void;
}) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: colores.texto.secundario, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        Próxima cita
      </div>
      {!item ? (
        <p style={{ fontSize: 13, color: colores.texto.secundario, margin: 0 }}>Sin citas próximas</p>
      ) : (
        <Fila clicable={puedeNavegar} onClick={() => onClic(item.cita.id)}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: colores.texto.principal }}>{item.cita.folio}</div>
            <div style={{ fontSize: 12, color: colores.texto.secundario }}>{item.cita.empresa}</div>
            <div style={{ fontSize: 12, color: colores.texto.secundario }}>
              {item.cita.ventanaInicio} – {item.cita.ventanaFin}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {item.minutosFaltantes >= 0 ? (
              <div style={{ fontSize: 14, fontWeight: 700, color: colores.status.active }}>
                en {formatMinutos(item.minutosFaltantes)}
              </div>
            ) : (
              <div style={{ fontSize: 14, fontWeight: 700, color: colores.status.error }}>
                atrasada {formatMinutos(Math.abs(item.minutosFaltantes))}
              </div>
            )}
          </div>
        </Fila>
      )}
    </div>
  );
}

function ColumnaMovimientos({ items, puedeNavegar, onClic }: {
  items: PanelAhoraData['movimientos']; puedeNavegar: boolean; onClic: (id: string) => void;
}) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: colores.texto.secundario, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        Movimientos
      </div>
      {items.length === 0 ? (
        <p style={{ fontSize: 13, color: colores.texto.secundario, margin: 0 }}>Sin movimientos pendientes</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(it => (
            <Fila key={it.cita.id} clicable={puedeNavegar} onClick={() => onClic(it.cita.id)}>
              <div className="flex items-center" style={{ gap: 8 }}>
                <InsigniaEstado estado={it.cita.estado} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: colores.texto.principal }}>{it.cita.folio}</div>
                  <div style={{ fontSize: 12, color: colores.texto.secundario }}>{it.cita.empresa}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: colores.status.pending }}>
                {formatMinutos(it.minutosEnEstado)}
              </div>
            </Fila>
          ))}
        </div>
      )}
    </div>
  );
}

function Fila({ children, clicable, onClick }: { children: React.ReactNode; clicable: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={clicable ? onClick : undefined}
      onMouseEnter={() => { if (clicable) setHover(true); }}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 10px', borderRadius: 6,
        cursor: clicable ? 'pointer' : 'default',
        backgroundColor: hover ? colores.superficie.hoverFila : 'transparent',
        transition: 'background-color 0.15s',
      }}
    >
      {children}
    </div>
  );
}
