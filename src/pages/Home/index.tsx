import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDay, faTruck, faCircleCheck, faClock,
  faCalendarWeek, faDatabase, faChartSimple, faListCheck,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { colores } from '@/kit/tokens/colores';
import { PLANTA_NOMBRE } from '@/lib/constants';
import { Tarjeta } from '@/kit/componentes/Tarjeta/Tarjeta';
import { InsigniaEstado } from '@/components/InsigniaEstado';
import { EmptyState } from '@/kit/componentes/EmptyState/EmptyState';
import { LoadingState } from '@/kit/componentes/LoadingState/LoadingState';
import { BarraProgreso } from './components/BarraProgreso';
import { useHome } from './useHome';

function calcTiempoTranscurrido(timestamp: string, ahora: Date): string {
  const diff = ahora.getTime() - new Date(timestamp).getTime();
  const totalMin = Math.max(0, Math.floor(diff / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m}m`;
}

interface KpiDef {
  label: string;
  valor: string | number;
  icon: IconDefinition;
  color: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const {
    citasHoy, citasSemana, enPatio, completadasHoy,
    esperaPromedioMin, citasPorEstado, totalCitas, actividadReciente,
  } = useHome();

  const [cargando] = useState(false);
  const [ahora, setAhora] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setAhora(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const kpis: KpiDef[] = [
    { label: 'Citas de hoy', valor: citasHoy, icon: faCalendarDay, color: colores.status.info },
    { label: 'En patio', valor: enPatio.length, icon: faTruck, color: colores.status.warning },
    { label: 'Completadas hoy', valor: completadasHoy, icon: faCircleCheck, color: colores.status.active },
    { label: 'Espera promedio', valor: `${esperaPromedioMin} min`, icon: faClock, color: colores.status.pending },
  ];

  if (cargando) return <LoadingState mensaje="Cargando inicio..." />;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: colores.texto.principal, margin: 0 }}>Home</h1>
        <p style={{ fontSize: 14, color: colores.texto.secundario, margin: '4px 0 0' }}>{PLANTA_NOMBRE}</p>
      </div>

      <div className="flex" style={{ gap: 20, marginBottom: 24 }}>
        {kpis.map(kpi => (
          <Tarjeta key={kpi.label} style={{ flex: 1 }}>
            <div className="flex justify-between items-start">
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: colores.texto.secundario, marginBottom: 8 }}>
                  {kpi.label}
                </div>
                <div style={{ fontSize: 30, fontWeight: 700, color: colores.texto.principal }}>{kpi.valor}</div>
              </div>
              <div
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  backgroundColor: `${kpi.color}26`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <FontAwesomeIcon icon={kpi.icon} style={{ color: kpi.color, fontSize: 16 }} />
              </div>
            </div>
          </Tarjeta>
        ))}
      </div>

      <div className="flex" style={{ gap: 20, marginBottom: 24 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Tarjeta>
            <div style={{ fontSize: 16, fontWeight: 700, color: colores.texto.principal, margin: '0 0 16px' }}>
              Citas por estado
            </div>
            {totalCitas === 0 ? (
              <EmptyState
                icon={faChartSimple}
                title="Sin citas registradas"
                description="Todavía no hay citas en el sistema."
              />
            ) : (
              <BarraProgreso
                items={citasPorEstado.map(e => ({ etiqueta: e.nombre, valor: e.valor, color: e.color }))}
                total={totalCitas}
              />
            )}
          </Tarjeta>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Tarjeta>
            <div style={{ fontSize: 16, fontWeight: 700, color: colores.texto.principal, margin: '0 0 16px' }}>
              Resumen de la semana
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 14, color: colores.texto.principal, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FontAwesomeIcon icon={faCalendarWeek} style={{ color: colores.texto.secundario, fontSize: 14 }} />
                Citas esta semana: {citasSemana}
              </div>
              <div style={{ fontSize: 14, color: colores.texto.principal, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FontAwesomeIcon icon={faDatabase} style={{ color: colores.texto.secundario, fontSize: 14 }} />
                Total histórico: {totalCitas}
              </div>
            </div>
          </Tarjeta>
        </div>
      </div>

      <div className="flex" style={{ gap: 20 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: colores.texto.principal, margin: '0 0 12px' }}>
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
                const tiempo = cita.entrada
                  ? calcTiempoTranscurrido(cita.entrada.timestamp, ahora)
                  : '—';
                return (
                  <Tarjeta key={cita.id} onClick={() => navigate(`/citas?cita=${cita.id}`)}>
                    <div className="flex justify-between items-center" style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: colores.texto.principal }}>{cita.folio}</span>
                      <InsigniaEstado estado={cita.estado} />
                    </div>
                    <div style={{ fontSize: 13, color: colores.texto.secundario }}>{cita.empresa}</div>
                    <div style={{ fontSize: 12, color: colores.texto.secundario }}>En patio: {tiempo}</div>
                  </Tarjeta>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: colores.texto.principal, margin: '0 0 12px' }}>
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
                return (
                  <Tarjeta key={transicion.id}>
                    <div className="flex justify-between items-center" style={{ marginBottom: 4 }}>
                      <InsigniaEstado estado={transicion.estado} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: colores.texto.principal }}>{folio}</span>
                    </div>
                    <div style={{ fontSize: 12, color: colores.texto.secundario }}>
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
