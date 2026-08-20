import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { faCalendarDays, faChevronLeft, faChevronRight, faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { rolActivoAtom } from '@/lib/store';
import { PLANTA_NOMBRE } from '@/lib/constants';
import { Boton } from '@/kit/componentes/Boton/Boton';
import { EmptyState } from '@/kit/componentes/EmptyState/EmptyState';
import { LoadingState } from '@/kit/componentes/LoadingState/LoadingState';
import { zIndex, MAIN_PADDING_TOP, MAIN_PADDING_BOTTOM } from '@/kit/tokens/layout';
import { colores } from '@/kit/tokens/colores';
import { prefersReducedMotion } from '@/kit/hooks/useModalTransition';
import { useCitas } from './useCitas';
import { TableroSemanal } from './components/TableroSemanal';
import { ModalDetalleCita } from './components/ModalDetalleCita';
import { PanelCrearCita } from './components/PanelCrearCita';

const OVERLAY_PADDING = 16;
const NAV_HEIGHT = 44;
const ENCABEZADO_ALTURA = 32 + 4 + 16 + 24 + 32 + 16;

export default function CitasPage() {
  const {
    citas, citasConSubEstado, diasSemana,
    semanaAnterior, semanaSiguiente,
    modalCita, setModalCita,
    vistaExpandida, setVistaExpandida,
    crearCita,
    editarCita,
    cancelarCita,
    borrarCita,
    ahora,
  } = useCitas();
  const rolActivo = useAtomValue(rolActivoAtom);
  const [searchParams, setSearchParams] = useSearchParams();
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [cargando] = useState(false);
  const [hoverBack, setHoverBack] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [hoverExpand, setHoverExpand] = useState(false);
  const [alturaViewport, setAlturaViewport] = useState(() => window.innerHeight);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [alturaInline, setAlturaInline] = useState(0);

  useEffect(() => {
    const citaParam = searchParams.get('cita');
    if (citaParam && !modalCita) {
      const found = citasConSubEstado.find(c => c.id === citaParam);
      if (found) setModalCita(found);
    }
  }, [searchParams, citasConSubEstado]);

  useEffect(() => {
    if (!vistaExpandida) return;
    const onResize = () => setAlturaViewport(window.innerHeight);
    window.addEventListener('resize', onResize);
    document.body.classList.add('citas-fullscreen');
    return () => {
      window.removeEventListener('resize', onResize);
      document.body.classList.remove('citas-fullscreen');
    };
  }, [vistaExpandida]);

  useEffect(() => {
    if (vistaExpandida) return;
    const medir = () => {
      if (contenedorRef.current) {
        setAlturaInline(contenedorRef.current.clientHeight);
      }
    };
    medir();
    const observer = new ResizeObserver(medir);
    if (contenedorRef.current) observer.observe(contenedorRef.current);
    window.addEventListener('resize', medir);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', medir);
    };
  }, [vistaExpandida]);

  const inicioLabel = format(diasSemana[0], 'd', { locale: es });
  const finLabel = format(diasSemana[6], "d MMM yyyy", { locale: es });
  const rangoLabel = `${inicioLabel} - ${finLabel}`;

  const alturaExpandida = alturaViewport - OVERLAY_PADDING * 2 - NAV_HEIGHT;
  const alturaInlineCalculada = alturaInline || (window.innerHeight - MAIN_PADDING_TOP - MAIN_PADDING_BOTTOM - ENCABEZADO_ALTURA);

  if (cargando) return <LoadingState mensaje="Cargando citas..." />;

  if (citas.length === 0) {
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#000000', margin: 0 }}>Citas</h1>
          <p style={{ fontSize: 16, fontWeight: 400, color: '#808285', margin: '4px 0 0' }}>
            {PLANTA_NOMBRE}
          </p>
        </div>
        <EmptyState
          icon={faCalendarDays}
          title="Sin citas registradas"
          description="Todavía no hay citas en el sistema."
        />
      </div>
    );
  }

  const navSemana = (
    <div className="flex items-center" style={{ gap: 8 }}>
      <button
        onClick={semanaAnterior}
        onMouseEnter={() => setHoverBack(true)}
        onMouseLeave={() => setHoverBack(false)}
        style={{
          border: `1px solid ${colores.nexteer.borderSoft}`,
          background: hoverBack ? colores.nexteer.page : colores.superficie.card,
          boxShadow: hoverBack ? '0 2px 6px rgba(0,0,0,0.12)' : 'none',
          borderRadius: 6, width: 32, height: 32, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background-color 0.15s ease-out, box-shadow 0.15s ease-out',
        }}
      >
        <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 14, color: '#000000' }} />
      </button>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#000000', minWidth: 160, textAlign: 'center' }}>
        {rangoLabel}
      </span>
      <button
        onClick={semanaSiguiente}
        onMouseEnter={() => setHoverNext(true)}
        onMouseLeave={() => setHoverNext(false)}
        style={{
          border: `1px solid ${colores.nexteer.borderSoft}`,
          background: hoverNext ? colores.nexteer.page : colores.superficie.card,
          boxShadow: hoverNext ? '0 2px 6px rgba(0,0,0,0.12)' : 'none',
          borderRadius: 6, width: 32, height: 32, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background-color 0.15s ease-out, box-shadow 0.15s ease-out',
        }}
      >
        <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 14, color: '#000000' }} />
      </button>
    </div>
  );

  const expandBtn = (
    <button
      onClick={() => setVistaExpandida(!vistaExpandida)}
      onMouseEnter={() => setHoverExpand(true)}
      onMouseLeave={() => setHoverExpand(false)}
      style={{
        border: `1px solid ${colores.nexteer.borderSoft}`,
        background: hoverExpand ? colores.nexteer.page : colores.superficie.card,
        boxShadow: hoverExpand ? '0 2px 6px rgba(0,0,0,0.12)' : 'none',
        borderRadius: 6, width: 32, height: 32, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background-color 0.15s ease-out, box-shadow 0.15s ease-out',
      }}
    >
      <FontAwesomeIcon
        icon={vistaExpandida ? faCompress : faExpand}
        style={{ fontSize: 14, color: '#000000' }}
      />
    </button>
  );

  const reducedMotion = prefersReducedMotion();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#000000', margin: 0 }}>Citas</h1>
        <p style={{ fontSize: 16, fontWeight: 400, color: '#808285', margin: '4px 0 0' }}>
          {PLANTA_NOMBRE}
        </p>
      </div>

      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <div className="flex items-center" style={{ gap: 12 }}>
          {navSemana}
          {expandBtn}
        </div>
        <div>
          {rolActivo === 'coordinador' && (
            <Boton onClick={() => setPanelAbierto(true)}>Nueva cita</Boton>
          )}
        </div>
      </div>

      {!vistaExpandida && (
        <div ref={contenedorRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <TableroSemanal
            citas={citasConSubEstado}
            diasSemana={diasSemana}
            onCitaClick={setModalCita}
            alturaDisponible={alturaInlineCalculada}
            ahora={ahora}
          />
        </div>
      )}

      {vistaExpandida && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: zIndex.panel,
            backgroundColor: '#FFFFFF',
            display: 'flex', flexDirection: 'column',
            padding: OVERLAY_PADDING,
            transition: reducedMotion ? 'none' : 'opacity 0.2s ease-out',
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 12, height: NAV_HEIGHT, flexShrink: 0 }}>
            <div className="flex items-center" style={{ gap: 12 }}>
              {navSemana}
            </div>
            {expandBtn}
          </div>
          <TableroSemanal
            citas={citasConSubEstado}
            diasSemana={diasSemana}
            onCitaClick={setModalCita}
            alturaDisponible={alturaExpandida}
            ahora={ahora}
          />
        </div>
      )}

      <ModalDetalleCita cita={modalCita} onClose={() => {
        setModalCita(null);
        if (searchParams.has('cita')) setSearchParams({}, { replace: true });
      }} onEditarCita={editarCita} onCancelarCita={cancelarCita} onBorrarCita={borrarCita} />

      {panelAbierto && (
        <PanelCrearCita
          onClose={() => setPanelAbierto(false)}
          onGuardar={input => { const r = crearCita(input); if (r.ok) setPanelAbierto(false); return r; }}
        />
      )}
    </div>
  );
}
