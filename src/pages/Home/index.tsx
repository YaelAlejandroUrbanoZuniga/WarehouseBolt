import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDay, faTruck, faCircleCheck, faClock,
  faCalendarWeek, faDatabase, faChartSimple,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { colores } from '@/kit/tokens/colores';
import { PLANTA_NOMBRE } from '@/lib/constants';
import { EncabezadoPantalla } from '@/kit/componentes/EncabezadoPantalla/EncabezadoPantalla';

import { Tarjeta } from '@/kit/componentes/Tarjeta/Tarjeta';
import { EmptyState } from '@/kit/componentes/EmptyState/EmptyState';
import { LoadingState } from '@/kit/componentes/LoadingState/LoadingState';
import { BarraProgreso } from './components/BarraProgreso';
import { CardActividadReciente } from './components/CardActividadReciente';
import { SeguimientoDelDia } from './components/SeguimientoDelDia';
import { useHome } from './useHome';

interface KpiDef {
  label: string;
  valor: string | number;
  icon: IconDefinition;
  color: string;
}

export default function HomePage() {
  const [cargando] = useState(false);
  const [ahora, setAhora] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setAhora(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const {
    citasHoy, citasSemana, enPatio, completadasHoy,
    esperaPromedioMin, citasPorEstado, totalCitas, actividadReciente,
    citasEnCasetaHoy, citasEnPatioHoy, citasSemanaCalendario,
  } = useHome(ahora);

  const kpis: KpiDef[] = [
    { label: 'Citas de hoy', valor: citasHoy, icon: faCalendarDay, color: colores.libres.info },
    { label: 'En patio', valor: enPatio.length, icon: faTruck, color: colores.libres.advertencia },
    { label: 'Completadas hoy', valor: completadasHoy, icon: faCircleCheck, color: colores.libres.exito },
    { label: 'Espera antes de descarga', valor: `${esperaPromedioMin} min`, icon: faClock, color: colores.libres.pendiente },
    { label: 'Citas esta semana', valor: citasSemana, icon: faCalendarWeek, color: colores.libres.info },
    { label: 'Total histórico', valor: totalCitas, icon: faDatabase, color: colores.nucleo.sidebar },
  ];

  if (cargando) return <LoadingState mensaje="Cargando inicio..." />;

  return (
    <div>
      <EncabezadoPantalla titulo="Home" subtitulo={PLANTA_NOMBRE} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        {kpis.map(kpi => (
          <div
            key={kpi.label}
            style={{
              background: colores.nucleo.superficie,
              borderRadius: 8,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              borderLeft: `4px solid ${kpi.color}`,
              padding: '20px 20px 20px 16px',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span style={{ fontSize: 14, fontWeight: 500, color: colores.texto.secundario, display: 'block' }}>
                  {kpi.label}
                </span>
                <span style={{ fontSize: 30, fontWeight: 700, color: colores.texto.principal, marginTop: 4, display: 'block' }}>
                  {kpi.valor}
                </span>
              </div>
              <div
                style={{
                  width: 48, height: 48, borderRadius: '50%',
                  backgroundColor: `${kpi.color}1F`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FontAwesomeIcon icon={kpi.icon} style={{ color: kpi.color, fontSize: 20 }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <SeguimientoDelDia
          citasEnCasetaHoy={citasEnCasetaHoy}
          citasEnPatioHoy={citasEnPatioHoy}
          citasSemanaArr={citasSemanaCalendario}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <Tarjeta>
          <div className="flex items-center" style={{ gap: 8, marginBottom: 16 }}>
            <FontAwesomeIcon icon={faChartSimple} style={{ fontSize: 14, color: colores.libres.info }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: colores.texto.principal }}>Citas por estado</span>
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

      <CardActividadReciente actividadReciente={actividadReciente} />
    </div>
  );
}
