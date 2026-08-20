import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faTruck, faListCheck } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { colores } from '@/kit/tokens/colores';
import { Tarjeta } from '@/kit/componentes/Tarjeta/Tarjeta';
import { Tabs } from '@/kit/componentes/Tabs/Tabs';
import { InsigniaEstado } from '@/components/InsigniaEstado';
import { EmptyState } from '@/kit/componentes/EmptyState/EmptyState';
import { formatearDuracion } from '@/lib/tiempo';
import type { Cita, TransicionEstado } from '@/lib/types';

interface Props {
  enPatio: Cita[];
  actividadReciente: { transicion: TransicionEstado; folio: string }[];
  ahora: Date;
}

export function CardActividadPatio({ enPatio, actividadReciente, ahora }: Props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('patio');

  const tabs = [
    { id: 'patio', label: `En patio (${enPatio.length})` },
    { id: 'actividad', label: 'Actividad reciente' },
  ];

  return (
    <Tarjeta>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab}>
        <div style={{ padding: '16px 0 0' }}>
          {activeTab === 'patio' && (
            <>
              {enPatio.length === 0 ? (
                <EmptyState
                  icon={faTruck}
                  title="Patio vacío"
                  description="No hay transportes en el patio en este momento."
                />
              ) : (
                <div>
                  {enPatio.map((cita, i) => {
                    const tiempo = cita.entrada
                      ? formatearDuracion(cita.entrada.timestamp, ahora)
                      : '—';
                    const isLast = i === enPatio.length - 1;
                    return (
                      <div
                        key={cita.id}
                        onClick={() => navigate(`/citas?cita=${cita.id}`)}
                        className="flex justify-between items-center"
                        style={{
                          padding: '12px 4px',
                          cursor: 'pointer',
                          borderBottom: isLast ? 'none' : `1px solid ${colores.nexteer.border}`,
                        }}
                      >
                        <div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: colores.texto.principal }}>{cita.folio}</span>
                          <span style={{ fontSize: 13, color: colores.texto.secundario, marginLeft: 8 }}>{cita.empresa}</span>
                        </div>
                        <div className="flex items-center" style={{ gap: 10 }}>
                          <span style={{ fontSize: 12, color: colores.texto.secundario }}>{tiempo}</span>
                          <InsigniaEstado estado={cita.estado} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'actividad' && (
            <>
              {actividadReciente.length === 0 ? (
                <EmptyState
                  icon={faListCheck}
                  title="Sin actividad"
                  description="No hay transiciones registradas."
                />
              ) : (
                <div>
                  {actividadReciente.map(({ transicion, folio }, i) => {
                    const isLast = i === actividadReciente.length - 1;
                    return (
                      <div
                        key={transicion.id}
                        className="flex justify-between items-center"
                        style={{
                          padding: '12px 4px',
                          borderBottom: isLast ? 'none' : `1px solid ${colores.nexteer.border}`,
                        }}
                      >
                        <div className="flex items-center" style={{ gap: 8 }}>
                          <InsigniaEstado estado={transicion.estado} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: colores.texto.principal }}>{folio}</span>
                        </div>
                        <div style={{ fontSize: 12, color: colores.texto.secundario }}>
                          {transicion.usuarioNombre} · {format(new Date(transicion.timestamp), "d MMM, HH:mm", { locale: es })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </Tabs>
    </Tarjeta>
  );
}
