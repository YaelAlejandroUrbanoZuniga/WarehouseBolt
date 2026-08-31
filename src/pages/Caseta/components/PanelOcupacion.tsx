import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { citasAtom, transicionesAtom, docksAtom } from '@/lib/store';
import { Tarjeta } from '@/kit/componentes/Tarjeta/Tarjeta';
import { EmptyState } from '@/kit/componentes/EmptyState/EmptyState';
import { LoadingState } from '@/kit/componentes/LoadingState/LoadingState';
import { formatearDuracion } from '@/lib/tiempo';
import type { TransicionEstado } from '@/lib/types';

interface Props {
  ahora: Date;
}

export function PanelOcupacion({ ahora }: Props) {
  const docks = useAtomValue(docksAtom);
  const citas = useAtomValue(citasAtom);
  const transiciones = useAtomValue(transicionesAtom);

  const docksActivos = useMemo(() => docks.filter(d => d.activo), [docks]);

  const ocupacion = useMemo(() => {
    return docksActivos.map(dock => {
      const citaEnDock = citas.find(
        c => c.dockId === dock.id && c.estado === 'en_descarga',
      );
      let tiempoDescarga: string | null = null;
      if (citaEnDock) {
        const trans = transiciones.find(
          (t: TransicionEstado) => t.citaId === citaEnDock.id && t.estado === 'en_descarga',
        );
        tiempoDescarga = trans ? formatearDuracion(trans.timestamp, ahora) : null;
      }
      return { dock, cita: citaEnDock ?? null, tiempoDescarga };
    });
  }, [docksActivos, citas, transiciones, ahora]);

  const cargando = docks.length === 0;

  if (cargando) return <LoadingState mensaje="Cargando rampas..." />;

  if (docksActivos.length === 0) {
    return (
      <EmptyState
        icon={faDoorOpen}
        title="Sin rampas activas"
        description="No hay rampas configuradas en esta planta."
      />
    );
  }

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#000000', margin: '0 0 8px' }}>
        Ocupación de rampas ahora
      </h2>
      <p style={{ fontSize: 12, color: '#808285', margin: '0 0 12px' }}>
        Úsalo para decidir si el transporte espera en caseta o pasa a planta.
      </p>
      <div className="flex" style={{ gap: 12, flexWrap: 'wrap' }}>
        {ocupacion.map(({ dock, cita, tiempoDescarga }) => (
          <Tarjeta key={dock.id} style={{ minWidth: 180, flex: '1 1 0' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#000000', marginBottom: 8 }}>
              {dock.nombre}
            </div>
            {cita ? (
              <>
                <div className="flex items-center" style={{ gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#D6336C', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#D6336C' }}>En descarga</span>
                </div>
                <div style={{ fontSize: 12, color: '#808285' }}>{cita.folio} · {cita.empresa}</div>
                {tiempoDescarga && (
                  <div style={{ fontSize: 12, color: '#808285', marginTop: 2 }}>{tiempoDescarga}</div>
                )}
              </>
            ) : (
              <div className="flex items-center" style={{ gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#6ABF4B', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#6ABF4B' }}>Libre</span>
              </div>
            )}
          </Tarjeta>
        ))}
      </div>
    </div>
  );
}
