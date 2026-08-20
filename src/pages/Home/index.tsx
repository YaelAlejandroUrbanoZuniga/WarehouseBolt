import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDay, faTruck, faCircleCheck, faClock,
  faCalendarWeek, faDatabase, faChartSimple,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { colores } from '@/kit/tokens/colores';
import { PLANTA_NOMBRE } from '@/lib/constants';
import { Tarjeta } from '@/kit/componentes/Tarjeta/Tarjeta';
import { EmptyState } from '@/kit/componentes/EmptyState/EmptyState';
import { LoadingState } from '@/kit/componentes/LoadingState/LoadingState';
import { BarraProgreso } from './components/BarraProgreso';
import { CardActividadPatio } from './components/CardActividadPatio';
import { useHome } from './useHome';

interface KpiDef {
  label: string;
  valor: string | number;
  icon: IconDefinition;
  color: string;
}

export default function HomePage() {
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
    { label: 'Espera antes de descarga', valor: `${esperaPromedioMin} min`, icon: faClock, color: colores.status.pending },
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div
                style={{
                  width: 56, height: 56, borderRadius: '50%',
                  backgroundColor: `${kpi.color}26`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <FontAwesomeIcon icon={kpi.icon} style={{ color: kpi.color, fontSize: 22 }} />
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, color: colores.texto.principal, marginBottom: 4 }}>
                {kpi.valor}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: colores.texto.secundario }}>
                {kpi.label}
              </div>
            </div>
          </Tarjeta>
        ))}
      </div>

      <div className="flex" style={{ gap: 20, marginBottom: 24 }}>
        <div style={{ flex: 2, minWidth: 0 }}>
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

        <Tarjeta style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                width: 56, height: 56, borderRadius: '50%',
                backgroundColor: `${colores.status.info}26`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <FontAwesomeIcon icon={faCalendarWeek} style={{ color: colores.status.info, fontSize: 22 }} />
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: colores.texto.principal, marginBottom: 4 }}>
              {citasSemana}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: colores.texto.secundario }}>
              Citas esta semana
            </div>
          </div>
        </Tarjeta>

        <Tarjeta style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                width: 56, height: 56, borderRadius: '50%',
                backgroundColor: `${colores.nexteer.sidebar}26`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <FontAwesomeIcon icon={faDatabase} style={{ color: colores.nexteer.sidebar, fontSize: 22 }} />
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: colores.texto.principal, marginBottom: 4 }}>
              {totalCitas}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: colores.texto.secundario }}>
              Total histórico
            </div>
          </div>
        </Tarjeta>
      </div>

      <CardActividadPatio enPatio={enPatio} actividadReciente={actividadReciente} ahora={ahora} />
    </div>
  );
}
