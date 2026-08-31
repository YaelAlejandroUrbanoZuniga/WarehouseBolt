import { useState, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { citasAtom, transicionesAtom, usuarioActivoAtom } from '@/lib/store';
import type { Cita, ResultadoAuditoria } from '@/lib/types';
import { Boton } from '@/kit/componentes/Boton/Boton';
import { Insignia } from '@/kit/componentes/Insignia/Insignia';
import { LoadingState } from '@/kit/componentes/LoadingState/LoadingState';
import { useToast } from '@/kit/componentes/Toast/Toast';
import { PanelEscaneo } from '@/components/PanelEscaneo';
import { ColumnaEstado } from './components/ColumnaEstado';
import { ModalCerrarDescarga } from './components/ModalCerrarDescarga';
import { ModalIniciarDescarga } from './components/ModalIniciarDescarga';

export default function AlmacenPage() {
  const [citas, setCitas] = useAtom(citasAtom);
  const [transiciones, setTransiciones] = useAtom(transicionesAtom);
  const usuarioActivo = useAtomValue(usuarioActivoAtom);
  const toast = useToast();

  const [iniciarCita, setIniciarCita] = useState<Cita | null>(null);
  const [cerrarCita, setCerrarCita] = useState<Cita | null>(null);
  const [cargando] = useState(false);

  const enPlanta = useMemo(() => citas.filter(c => c.estado === 'en_planta'), [citas]);
  const enDescarga = useMemo(() => citas.filter(c => c.estado === 'en_descarga'), [citas]);
  const saliendo = useMemo(() => citas.filter(c => c.estado === 'saliendo'), [citas]);

  function cerrarDescarga(resultado: ResultadoAuditoria) {
    if (!cerrarCita) return;
    const ahora = new Date().toISOString();
    const nombre = usuarioActivo?.nombre ?? 'Sistema';

    setCitas(citas.map(c => c.id === cerrarCita.id
      ? { ...c, estado: 'saliendo' as const, resultadoAuditoria: resultado }
      : c,
    ));
    setTransiciones([...transiciones, {
      id: crypto.randomUUID(), citaId: cerrarCita.id,
      estado: 'saliendo', usuarioNombre: nombre, timestamp: ahora, nota: resultado,
    }]);

    toast.success(`Descarga cerrada: ${cerrarCita.folio}`, 'Vigilancia puede darle salida.');
    setCerrarCita(null);
  }

  function toggleDocumentacion(cita: Cita) {
    setCitas(citas.map(c => c.id === cita.id
      ? { ...c, documentacionRecibida: !c.documentacionRecibida }
      : c,
    ));
  }

  if (cargando) return <LoadingState mensaje="Cargando almacén..." />;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <PanelEscaneo
          titulo="Iniciar descarga"
          estadosValidos={['en_planta']}
          onCitaEncontrada={cita => setIniciarCita(cita)}
        />
      </div>

      <div className="flex" style={{ gap: 20 }}>
        <ColumnaEstado titulo="En planta" citas={enPlanta} renderCita={() => (
          <p style={{ fontSize: 12, color: '#808285', margin: 0 }}>
            Escanea su código para iniciar la descarga.
          </p>
        )} />

        <ColumnaEstado titulo="En descarga" citas={enDescarga} renderCita={cita => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#000000' }}>
              <input
                type="checkbox"
                checked={!!cita.documentacionRecibida}
                onChange={() => toggleDocumentacion(cita)}
                style={{ accentColor: '#DC0202' }}
              />
              Documentación recibida
            </label>
            <p style={{ fontSize: 12, color: '#808285', margin: 0 }}>
              Pendiente de definir con almacén qué documentos aplican.
            </p>
            <Boton onClick={() => setCerrarCita(cita)}>Cerrar descarga</Boton>
          </div>
        )} />

        <ColumnaEstado titulo="Saliendo" citas={saliendo} renderCita={cita => (
          <div>
            {cita.resultadoAuditoria && (
              <Insignia estado={cita.resultadoAuditoria === 'completo' ? 'active' : cita.resultadoAuditoria === 'incompleto' ? 'warning' : 'error'}>
                {cita.resultadoAuditoria === 'completo' ? 'Completo' : cita.resultadoAuditoria === 'incompleto' ? 'Incompleto' : 'Dañado'}
              </Insignia>
            )}
            <p style={{ fontSize: 12, color: '#808285', margin: '8px 0 0' }}>
              Esperando que vigilancia le dé salida en caseta.
            </p>
          </div>
        )} />
      </div>

      {iniciarCita && (
        <ModalIniciarDescarga cita={iniciarCita} onClose={() => setIniciarCita(null)} />
      )}

      {cerrarCita && (
        <ModalCerrarDescarga
          cita={cerrarCita}
          onClose={() => setCerrarCita(null)}
          onConfirmar={cerrarDescarga}
        />
      )}
    </div>
  );
}
