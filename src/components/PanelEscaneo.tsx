import { useState, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { citasAtom } from '@/lib/store';
import { ESTADOS } from '@/lib/constants';
import { buscarPorCodigo } from '@/lib/codigo-acceso';
import { Tarjeta } from '@/kit/componentes/Tarjeta/Tarjeta';
import { Tabs } from '@/kit/componentes/Tabs/Tabs';
import { CampoTexto } from '@/kit/componentes/CampoTexto/CampoTexto';
import { Boton } from '@/kit/componentes/Boton/Boton';
import { colores } from '@/kit/tokens/colores';
import type { Cita, EstadoCita } from '@/lib/types';

interface Props {
  titulo: string;
  estadosValidos: EstadoCita[];
  onCitaEncontrada: (cita: Cita) => void;
}

const TABS = [
  { id: 'qr', label: 'Escanear QR' },
  { id: 'manual', label: 'Código manual' },
];

export function PanelEscaneo({ titulo, estadosValidos, onCitaEncontrada }: Props) {
  const citas = useAtomValue(citasAtom);
  const [tab, setTab] = useState('qr');
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [showList, setShowList] = useState(false);

  const citasValidas = useMemo(
    () => citas.filter(c => estadosValidos.includes(c.estado)),
    [citas, estadosValidos],
  );

  function buscar() {
    setError('');
    const cita = buscarPorCodigo(codigo, citas);
    if (!cita) {
      setError('Código no encontrado. Verifica con el coordinador.');
      return;
    }
    if (cita.estado === 'cancelada') {
      setError('Esta cita fue cancelada.');
      return;
    }
    if (!estadosValidos.includes(cita.estado)) {
      setError(`Esta cita ya está en estado: ${ESTADOS[cita.estado].nombre}.`);
      return;
    }
    setCodigo('');
    onCitaEncontrada(cita);
  }

  return (
    <Tarjeta>
      <div style={{ fontSize: 20, fontWeight: 700, color: colores.texto.principal, marginBottom: 16 }}>
        {titulo}
      </div>
      <Tabs tabs={TABS} activeTab={tab} onChange={setTab}>
        <div style={{ paddingTop: 16 }}>
          {tab === 'qr' && (
            <div className="flex flex-col items-center" style={{ gap: 16 }}>
              <div
                style={{
                  width: 240, height: 240, backgroundColor: colores.texto.principal,
                  borderRadius: 12, position: 'relative', overflow: 'hidden',
                }}
              >
                <Corner top={0} left={0} borderTop borderLeft />
                <Corner top={0} right={0} borderTop borderRight />
                <Corner bottom={0} left={0} borderBottom borderLeft />
                <Corner bottom={0} right={0} borderBottom borderRight />
                <div className="scan-line" style={{
                  position: 'absolute', left: 0, right: 0, height: 2,
                  backgroundColor: colores.libres.exito,
                }} />
              </div>
              <p style={{ fontSize: 13, color: colores.texto.secundario, textAlign: 'center', margin: 0 }}>
                Apunta la cámara al código QR del transportista.
              </p>
              <Boton variante="secundario" onClick={() => setShowList(!showList)}>
                Simular escaneo (modo prototipo)
              </Boton>
              {showList && (
                <div style={{
                  width: '100%', maxHeight: 200, overflowY: 'auto',
                  border: `1px solid ${colores.superficie.borde}`, borderRadius: 8,
                }}>
                  {citasValidas.length === 0 ? (
                    <div style={{ padding: 12, fontSize: 13, color: colores.texto.secundario, textAlign: 'center' }}>
                      No hay citas en estados válidos.
                    </div>
                  ) : citasValidas.map(c => (
                    <SimRow key={c.id} cita={c} onSelect={() => { setShowList(false); onCitaEncontrada(c); }} />
                  ))}
                </div>
              )}
            </div>
          )}
          {tab === 'manual' && (
            <div style={{ maxWidth: 360 }}>
              <CampoTexto
                label="Código de acceso"
                placeholder="DF202608XXXXX"
                value={codigo}
                onChange={e => { setCodigo(e.target.value.toUpperCase()); setError(''); }}
              />
              {error && (
                <p style={{ fontSize: 13, color: colores.nucleo.accion, margin: '8px 0 0' }}>{error}</p>
              )}
              <div style={{ marginTop: 12 }}>
                <Boton onClick={buscar} disabled={codigo.trim().length === 0}>
                  Buscar cita
                </Boton>
              </div>
            </div>
          )}
        </div>
      </Tabs>
    </Tarjeta>
  );
}

function Corner({ top, bottom, left, right, borderTop, borderBottom, borderLeft, borderRight }: {
  top?: number; bottom?: number; left?: number; right?: number;
  borderTop?: boolean; borderBottom?: boolean; borderLeft?: boolean; borderRight?: boolean;
}) {
  return (
    <div style={{
      position: 'absolute', width: 32, height: 32,
      top: top ?? undefined, bottom: bottom ?? undefined,
      left: left ?? undefined, right: right ?? undefined,
      borderTop: borderTop ? `3px solid ${colores.libres.exito}` : 'none',
      borderBottom: borderBottom ? `3px solid ${colores.libres.exito}` : 'none',
      borderLeft: borderLeft ? `3px solid ${colores.libres.exito}` : 'none',
      borderRight: borderRight ? `3px solid ${colores.libres.exito}` : 'none',
    }} />
  );
}

function SimRow({ cita, onSelect }: { cita: Cita; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '8px 12px', cursor: 'pointer', fontSize: 13,
        backgroundColor: hovered ? colores.superficie.hoverFila : 'transparent',
        borderBottom: `1px solid ${colores.nucleo.fondoApp}`,
      }}
    >
      <span style={{ fontWeight: 600, color: colores.texto.principal }}>{cita.folio}</span>
      <span style={{ color: colores.texto.secundario, margin: '0 8px' }}>·</span>
      <span style={{ color: colores.texto.secundario }}>{cita.empresa}</span>
    </div>
  );
}
