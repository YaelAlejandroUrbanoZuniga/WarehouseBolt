import { useState, useMemo, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPen, faBan, faTrash, faCopy, faPrint } from '@fortawesome/free-solid-svg-icons';
import { QRCodeSVG } from 'qrcode.react';
import { TRANSICIONES_PERMITIDAS } from '@/lib/constants';
import { COLOR_RETRASO } from '@/lib/ui-map';
import { InsigniaEstado } from '@/components/InsigniaEstado';
import { CampoTexto } from '@/kit/componentes/CampoTexto/CampoTexto';
import { Boton } from '@/kit/componentes/Boton/Boton';
import { ConfirmDialog } from '@/kit/componentes/ConfirmDialog/ConfirmDialog';
import { docksAtom, rolActivoAtom } from '@/lib/store';
import { colores } from '@/kit/tokens/colores';
import { calcularTiempos } from '../utils';
import { PaseImprimible } from './PaseImprimible';
import type { Cita, CitaEditInput, TransicionEstado } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function fmtFecha(ts: string): string {
  return format(new Date(ts), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
}

interface Props {
  cita: Cita;
  transiciones: TransicionEstado[];
  onEditarCita: (citaId: string, input: CitaEditInput) => void;
  onCancelarCita: (citaId: string) => void;
  onBorrarCita: (citaId: string) => void;
  onClose: () => void;
}

export function ResumenCita({ cita, transiciones, onEditarCita, onCancelarCita, onBorrarCita, onClose }: Props) {
  const docks = useAtomValue(docksAtom);
  const rolActivo = useAtomValue(rolActivoAtom);
  const esRetraso = cita.subEstado === 'retraso';

  const [editando, setEditando] = useState(false);
  const [poNumero, setPoNumero] = useState(cita.poNumero);
  const [transportistaLabel, setTransportistaLabel] = useState(cita.empresa);
  const [origen, setOrigen] = useState(cita.origen);
  const [destino, setDestino] = useState(cita.destino);
  const [notas, setNotas] = useState(cita.notas ?? '');
  const [confirmarCancelar, setConfirmarCancelar] = useState(false);
  const [confirmarBorrar, setConfirmarBorrar] = useState(false);

  const dockNombre = useMemo(() => {
    if (!cita.dockId) return 'Sin asignar';
    return docks.find(d => d.id === cita.dockId)?.nombre ?? 'Sin asignar';
  }, [cita.dockId, docks]);

  const tiempos = useMemo(() => calcularTiempos(cita, transiciones), [cita, transiciones]);

  const camposAcceso = useMemo(() => [
    { label: 'Transportista', value: cita.entrada?.transportista },
    { label: 'Placas', value: cita.entrada?.placas },
    { label: 'Caja entrada', value: cita.entrada?.numeroCaja },
    { label: 'Sello entrada', value: cita.entrada?.sello },
    { label: 'Hora entrada', value: cita.entrada?.timestamp ? fmtFecha(cita.entrada.timestamp) : undefined },
    { label: 'Caja salida', value: cita.salida?.numeroCaja },
    { label: 'Sello salida', value: cita.salida?.sello },
    { label: 'Hora salida', value: cita.salida?.timestamp ? fmtFecha(cita.salida.timestamp) : undefined },
  ], [cita.entrada, cita.salida]);

  const puedeEditar = rolActivo === 'coordinador' && cita.estado !== 'cancelada';
  const puedeCancelar = rolActivo === 'coordinador' && TRANSICIONES_PERMITIDAS[cita.estado].includes('cancelada');
  const puedeBorrar = cita.estado === 'cancelada';

  function iniciarEdicion() {
    setPoNumero(cita.poNumero);
    setTransportistaLabel(cita.empresa);
    setOrigen(cita.origen);
    setDestino(cita.destino);
    setNotas(cita.notas ?? '');
    setEditando(true);
  }

  function guardar() {
    onEditarCita(cita.id, {
      poNumero: poNumero.trim(),
      empresa: transportistaLabel.trim(),
      origen: origen.trim(),
      destino: destino.trim(),
      notas: notas.trim() || undefined,
    });
    setEditando(false);
  }

  if (editando) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="grid grid-cols-2" style={{ gap: 16 }}>
          <CampoTexto label="Número de PO" value={poNumero} onChange={e => setPoNumero(e.target.value)} />
          <CampoTexto label="Transportista" value={transportistaLabel} onChange={e => setTransportistaLabel(e.target.value)} />
        </div>
        <div className="grid grid-cols-2" style={{ gap: 16 }}>
          <CampoTexto label="Origen" value={origen} onChange={e => setOrigen(e.target.value)} />
          <CampoTexto label="Destino" value={destino} onChange={e => setDestino(e.target.value)} />
        </div>
        <CampoTexto label="Notas (opcional)" value={notas} onChange={e => setNotas(e.target.value)} />

        <Seccion titulo="Programacion (solo lectura)">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: 13, color: '#000000' }}>
            <InfoRow label="Fecha" value={cita.fechaProgramada} />
            <InfoRow label="Ventana" value={`${cita.ventanaInicio} - ${cita.ventanaFin}`} />
          </div>
          <p style={{ fontSize: 11, color: colores.texto.secundario, margin: '8px 0 0' }}>
            El horario se reprograma desde otra vista.
          </p>
        </Seccion>

        <div className="flex justify-end" style={{ gap: 8, marginTop: 4 }}>
          <Boton variante="secundario" onClick={() => setEditando(false)}>Cancelar edicion</Boton>
          <Boton onClick={guardar}>Guardar cambios</Boton>
        </div>
      </div>
    );
  }

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

      <div>
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <div className="flex items-center" style={{ gap: 10 }}>
            <InsigniaEstado estado={cita.estado} />
            {esRetraso && (
              <span style={{ fontSize: 12, fontWeight: 600, color: COLOR_RETRASO }}>
                Retraso detectado
              </span>
            )}
          </div>
          {puedeEditar && (
            <Boton variante="secundario" onClick={iniciarEdicion}>
              <FontAwesomeIcon icon={faPen} style={{ fontSize: 12, marginRight: 6 }} />
              Editar
            </Boton>
          )}
        </div>
        <div style={{ fontSize: 13, color: '#808285' }}>
          {cita.empresa || 'Sin transportista'} · {cita.origen}
          <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 10, margin: '0 4px' }} />
          {cita.destino} · {cita.poNumero}
        </div>
        {esRetraso && (
          <p style={{ fontSize: 12, color: COLOR_RETRASO, margin: '8px 0 0', fontWeight: 500 }}>
            Han pasado mas de 30 minutos sin avance al siguiente estado.
          </p>
        )}
        {cita.notas && (
          <p style={{ fontSize: 12, color: colores.texto.secundario, margin: '8px 0 0' }}>
            {cita.notas}
          </p>
        )}
      </div>

      <Seccion titulo="Programacion">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: 13, color: '#000000' }}>
          <InfoRow label="Fecha" value={cita.fechaProgramada} />
          <InfoRow label="Ventana" value={`${cita.ventanaInicio} - ${cita.ventanaFin}`} />
          <InfoRow label="Rampa" value={dockNombre} />
          <InfoRow label="Creado por" value={cita.creadoPorNombre} />
        </div>
      </Seccion>

      <Seccion titulo="Registro de acceso">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
          {camposAcceso.map(c => (
            <div key={c.label} style={{ fontSize: 13 }}>
              <span style={{ color: '#808285' }}>{c.label}: </span>
              <span style={{ color: c.value ? '#000000' : '#808285' }}>{c.value ?? '—'}</span>
            </div>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Tiempos">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: 13, color: '#000000' }}>
          <InfoRow label="Espera antes de descarga" value={tiempos.tiempoCaseta} />
          <InfoRow label="Tiempo de descarga" value={tiempos.tiempoDescarga} />
          <InfoRow label="Tiempo hasta salida" value={tiempos.tiempoSalida} />
          <InfoRow label="Tiempo total" value={tiempos.tiempoTotal} />
        </div>
      </Seccion>

      {(puedeCancelar || puedeBorrar) && (
        <div style={{ borderTop: `1px solid ${colores.nexteer.border}`, paddingTop: 16 }}>
          <div className="flex" style={{ gap: 12 }}>
            {puedeCancelar && (
              <Boton variante="peligro" onClick={() => setConfirmarCancelar(true)}>
                <FontAwesomeIcon icon={faBan} style={{ fontSize: 12, marginRight: 6 }} />
                Cancelar cita
              </Boton>
            )}
            {puedeBorrar && (
              <Boton variante="peligro" onClick={() => setConfirmarBorrar(true)}>
                <FontAwesomeIcon icon={faTrash} style={{ fontSize: 12, marginRight: 6 }} />
                Borrar cita
              </Boton>
            )}
          </div>
        </div>
      )}

      {confirmarCancelar && (
        <ConfirmDialog
          title="Cancelar cita"
          message={`¿Cancelar la cita ${cita.folio}? Esta acción no se puede deshacer.`}
          confirmLabel="Cancelar cita"
          onCancel={() => setConfirmarCancelar(false)}
          onConfirm={() => { onCancelarCita(cita.id); onClose(); }}
        />
      )}

      {confirmarBorrar && (
        <ConfirmDialog
          title="Borrar cita"
          message={`¿Borrar permanentemente la cita ${cita.folio}? Se perderá todo su historial y no se puede deshacer.`}
          confirmLabel="Borrar cita"
          onCancel={() => setConfirmarBorrar(false)}
          onConfirm={() => { onBorrarCita(cita.id); onClose(); }}
        />
      )}

      <div className="pase-imprimible-wrapper" style={{ display: 'none' }}>
        <PaseImprimible cita={cita} />
      </div>
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#000000', marginBottom: 10 }}>{titulo}</div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ fontSize: 13 }}>
      <span style={{ color: '#808285', fontWeight: 500 }}>{label}: </span>
      <span style={{ color: '#000000' }}>{value}</span>
    </div>
  );
}
