import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { faTruck, faListCheck } from '@fortawesome/free-solid-svg-icons';
import { PLANTA_NOMBRE, ESTADOS } from '@/lib/constants';
import { Tarjeta } from '@/kit/componentes/Tarjeta/Tarjeta';
import { Insignia } from '@/kit/componentes/Insignia/Insignia';
import { EmptyState } from '@/kit/componentes/EmptyState/EmptyState';
import { LoadingState } from '@/kit/componentes/LoadingState/LoadingState';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTablero } from './useTablero';

function calcTiempoTranscurrido(timestamp: string, ahora: Date): string {
  const diff = ahora.getTime() - new Date(timestamp).getTime();
  const totalMin = Math.max(0, Math.floor(diff / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m}m`;
}

export default function TableroPage() {
  const navigate = useNavigate();
  const { citasHoy, enPatio, enCaseta, esperaPromedio, actividadReciente } = useTablero();
  const [cargando] = useState(false);
  const [ahora, setAhora] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setAhora(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const kpis = useMemo(() => [
    { label: 'Citas de hoy', valor: citasHoy },
    { label: 'En patio', valor: enPatio.length },
    { label: 'En caseta', valor: enCaseta },
    { label: 'Espera promedio hoy', valor: `${esperaPromedio} min` },
  ], [citasHoy, enPatio.length, enCaseta, esperaPromedio]);

  if (cargando) return <LoadingState mensaje="Cargando tablero..." />;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#000000', margin: 0 }}>Tablero</h1>
        <p style={{ fontSize: 14, color: '#808285', margin: '4px 0 0' }}>{PLANTA_NOMBRE}</p>
      </div>

      <div className="flex" style={{ gap: 20, marginBottom: 24 }}>
        {kpis.map(kpi => (
          <Tarjeta key={kpi.label} style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#808285', marginBottom: 8 }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#000000' }}>{kpi.valor}</div>
          </Tarjeta>
        ))}
      </div>

      <div className="flex" style={{ gap: 20 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#000000', margin: '0 0 12px' }}>
            En patio ahora
          </h2>
          {enPatio.length === 0 ? (
            <EmptyState
              icon={faTruck}
              title="Patio vacío"
              description="No hay transportes en el patio en este momento."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {enPatio.map(cita => {
                const cfg = ESTADOS[cita.estado];
                const tiempo = cita.entrada
                  ? calcTiempoTranscurrido(cita.entrada.timestamp, ahora)
                  : '—';
                return (
                  <Tarjeta key={cita.id} onClick={() => navigate(`/citas?cita=${cita.id}`)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#000000' }}>{cita.folio}</span>
                      <Insignia estado={cfg.insignia}>{cfg.nombre}</Insignia>
                    </div>
                    <div style={{ fontSize: 13, color: '#808285' }}>{cita.empresa}</div>
                    <div style={{ fontSize: 12, color: '#808285' }}>En patio: {tiempo}</div>
                  </Tarjeta>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#000000', margin: '0 0 12px' }}>
            Actividad reciente
          </h2>
          {actividadReciente.length === 0 ? (
            <EmptyState
              icon={faListCheck}
              title="Sin actividad"
              description="No hay transiciones registradas."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {actividadReciente.map(({ transicion, folio }) => {
                const cfg = ESTADOS[transicion.estado];
                return (
                  <Tarjeta key={transicion.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Insignia estado={cfg.insignia}>{cfg.nombre}</Insignia>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#000000' }}>{folio}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#808285' }}>
                      {transicion.usuarioNombre} · {format(new Date(transicion.timestamp), "d MMM, HH:mm", { locale: es })}
                    </div>
                  </Tarjeta>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
