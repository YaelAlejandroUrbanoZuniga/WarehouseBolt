import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { colores } from '@/kit/tokens/colores';
import { Tarjeta } from '@/kit/componentes/Tarjeta/Tarjeta';
import { Boton } from '@/kit/componentes/Boton/Boton';
import { ESTADO_UI, COLOR_RETRASO } from '@/lib/ui-map';
import { ESTADOS } from '@/lib/constants';
import { rolActivoAtom } from '@/lib/store';
import type { ItemSeguimiento, ItemSemana } from '../useHome';

interface Props {
  citasEnCasetaHoy: ItemSeguimiento[];
  citasEnPatioHoy: ItemSeguimiento[];
  citasSemanaArr: ItemSemana[];
}

export function SeguimientoDelDia({ citasEnCasetaHoy, citasEnPatioHoy, citasSemanaArr }: Props) {
  const rolActivo = useAtomValue(rolActivoAtom);
  const navigate = useNavigate();
  const puedeNavegar = rolActivo !== 'vigilancia';

  function irACita(id: string) {
    if (puedeNavegar) navigate(`/citas?cita=${id}`);
  }

  return (
    <Tarjeta>
      <div className="flex items-center" style={{ gap: 8, marginBottom: 16 }}>
        <FontAwesomeIcon icon={faListCheck} style={{ fontSize: 14, color: colores.nucleo.accion }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: colores.texto.principal }}>Seguimiento del día</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
        <Bloque titulo="En caseta">
          {citasEnCasetaHoy.length === 0 ? (
            <TextoVacio>Sin citas el día de hoy</TextoVacio>
          ) : (
            <>
              <ListaFilas items={citasEnCasetaHoy.slice(0, 3)} clicable={puedeNavegar} onClic={irACita} />
              {citasEnCasetaHoy.length > 3 && <VerTodas total={citasEnCasetaHoy.length} onClick={() => navigate('/citas')} />}
            </>
          )}
        </Bloque>

        <Bloque titulo="En patio" conBorde>
          {citasEnPatioHoy.length === 0 ? (
            <TextoVacio>Sin citas el día de hoy</TextoVacio>
          ) : (
            <>
              <ListaFilas items={citasEnPatioHoy.slice(0, 3)} clicable={puedeNavegar} onClic={irACita} />
              {citasEnPatioHoy.length > 3 && <VerTodas total={citasEnPatioHoy.length} onClick={() => navigate('/citas')} />}
            </>
          )}
        </Bloque>

        <Bloque titulo="Citas en la semana" conBorde>
          {citasSemanaArr.length === 0 ? (
            <TextoVacio>Sin citas esta semana</TextoVacio>
          ) : (
            <>
              <ListaSemana items={citasSemanaArr.slice(0, 3)} clicable={puedeNavegar} onClic={irACita} />
              {citasSemanaArr.length > 3 && <VerTodas total={citasSemanaArr.length} onClick={() => navigate('/citas')} />}
            </>
          )}
        </Bloque>
      </div>
    </Tarjeta>
  );
}

function Bloque({ titulo, conBorde, children }: { titulo: string; conBorde?: boolean; children: React.ReactNode }) {
  return (
    <div style={conBorde ? { borderLeft: `1px solid ${colores.superficie.bordeSuave}`, paddingLeft: 24 } : undefined}>
      <div style={{ fontSize: 13, fontWeight: 700, color: colores.texto.principal, marginBottom: 12 }}>
        {titulo}
      </div>
      {children}
    </div>
  );
}

function TextoVacio({ children }: { children: string }) {
  return (
    <p style={{ fontSize: 13, color: colores.texto.secundario, margin: 0, textAlign: 'center', padding: '24px 0' }}>
      {children}
    </p>
  );
}

function VerTodas({ total, onClick }: { total: number; onClick: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
      <Boton variante="terciario" onClick={onClick} style={{ fontSize: 12 }}>
        Ver todas ({total})
      </Boton>
    </div>
  );
}

function ListaFilas({ items, clicable, onClic }: { items: ItemSeguimiento[]; clicable: boolean; onClic: (id: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map(it => (
        <FilaEstado key={it.cita.id} item={it} clicable={clicable} onClick={() => onClic(it.cita.id)} />
      ))}
    </div>
  );
}

function FilaEstado({ item, clicable, onClick }: { item: ItemSeguimiento; clicable: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const esRetraso = item.cita.subEstado === 'retraso';
  const colorBase = esRetraso ? COLOR_RETRASO : ESTADO_UI[item.cita.estado].color;
  const bgColor = esRetraso ? COLOR_RETRASO : `${colorBase}26`;
  const textColor = esRetraso ? '#FFFFFF' : colores.texto.principal;
  const subColor = esRetraso ? 'rgba(255,255,255,0.85)' : colores.texto.secundario;
  const iconBg = esRetraso ? 'rgba(255,255,255,0.25)' : `${colorBase}26`;
  const iconColor = esRetraso ? '#FFFFFF' : colorBase;
  const ui = ESTADO_UI[item.cita.estado];

  return (
    <div
      className={esRetraso ? 'flex items-center retraso-parpadeo' : 'flex items-center'}
      onClick={clicable ? onClick : undefined}
      onMouseEnter={() => { if (clicable) setHover(true); }}
      onMouseLeave={() => setHover(false)}
      style={{
        gap: 12,
        padding: '10px 12px',
        borderRadius: 8,
        backgroundColor: hover ? colores.superficie.hoverFila : bgColor,
        cursor: clicable ? 'pointer' : 'default',
        transition: 'background-color 0.12s',
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: iconBg, flexShrink: 0 }}
      >
        <FontAwesomeIcon icon={ui.icon} style={{ fontSize: 14, color: iconColor }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-center" style={{ gap: 4 }}>
          {esRetraso && (
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="retraso-parpadeo"
              style={{ color: '#FFFFFF', fontSize: 12 }}
            />
          )}
          <span style={{ fontSize: 13, fontWeight: 600, color: textColor }}>
            {item.cita.folio} — {item.cita.empresa}
          </span>
        </div>
        <div style={{ fontSize: 12, color: subColor, marginTop: 2 }}>
          {ESTADOS[item.cita.estado].nombre}
        </div>
      </div>

      <div style={{ flexShrink: 0 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: textColor }}>{item.minutosEnEstado}</span>
        <span style={{ fontSize: 11, fontWeight: 400, color: subColor, marginLeft: 3 }}>min</span>
      </div>
    </div>
  );
}

function ListaSemana({ items, clicable, onClic }: { items: ItemSemana[]; clicable: boolean; onClic: (id: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map(it => (
        <FilaSemana key={it.cita.id} item={it} clicable={clicable} onClick={() => onClic(it.cita.id)} />
      ))}
    </div>
  );
}

function FilaSemana({ item, clicable, onClick }: { item: ItemSemana; clicable: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const colorBase = colores.libres.info;
  const icono = ESTADO_UI.programada.icon;

  return (
    <div
      className="flex items-center"
      onClick={clicable ? onClick : undefined}
      onMouseEnter={() => { if (clicable) setHover(true); }}
      onMouseLeave={() => setHover(false)}
      style={{
        gap: 12,
        padding: '10px 12px',
        borderRadius: 8,
        backgroundColor: hover ? colores.superficie.hoverFila : `${colorBase}14`,
        cursor: clicable ? 'pointer' : 'default',
        transition: 'background-color 0.12s',
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: `${colorBase}26`, flexShrink: 0 }}
      >
        <FontAwesomeIcon icon={icono} style={{ fontSize: 14, color: colorBase }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colores.texto.principal }}>
          {item.cita.folio} — {item.cita.empresa}
        </div>
        <div style={{ fontSize: 12, color: colores.texto.secundario, marginTop: 2 }}>
          {item.diaEtiqueta}
        </div>
      </div>
    </div>
  );
}
