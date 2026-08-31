import { useState, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useModalTransition } from '@/kit/hooks/useModalTransition';
import { ModalHeader } from '@/kit/componentes/ModalHeader/ModalHeader';
import { CampoTexto } from '@/kit/componentes/CampoTexto/CampoTexto';
import { SelectCatalogo } from '@/kit/componentes/SelectCatalogo/SelectCatalogo';
import { Boton } from '@/kit/componentes/Boton/Boton';
import { ConfirmDialog } from '@/kit/componentes/ConfirmDialog/ConfirmDialog';
import { useToast } from '@/kit/componentes/Toast/Toast';
import { zIndex } from '@/kit/tokens/layout';
import { colores } from '@/kit/tokens/colores';
import { transportistasAtom } from '@/lib/store';
import type { Proveedor, ProveedorInput } from '@/lib/types';

interface Props {
  onClose: () => void;
  onGuardar: (input: ProveedorInput) => { ok: true } | { ok: false; motivo: string };
  proveedor?: Proveedor;
}

export function PanelProveedor({ onClose, onGuardar, proveedor }: Props) {
  const toast = useToast();
  const { requestClose, overlayClass, panelClass } = useModalTransition(onClose);
  const transportistas = useAtomValue(transportistasAtom);

  const opcionesTransporte = useMemo(
    () => transportistas.map(t => t.empresa),
    [transportistas],
  );

  const [nombre, setNombre] = useState(proveedor?.nombre ?? '');
  const [codigo, setCodigo] = useState(proveedor?.codigo ?? '');
  const [origenPredeterminado, setOrigenPredeterminado] = useState(proveedor?.origenPredeterminado ?? '');
  const [lineaTransporteHabitual, setLineaTransporteHabitual] = useState(proveedor?.lineaTransporteHabitual ?? '');
  const [contactoNombre, setContactoNombre] = useState(proveedor?.contactoNombre ?? '');
  const [contactoTelefono, setContactoTelefono] = useState(proveedor?.contactoTelefono ?? '');
  const [contactoCorreo, setContactoCorreo] = useState(proveedor?.contactoCorreo ?? '');
  const [notas, setNotas] = useState(proveedor?.notas ?? '');
  const [confirmar, setConfirmar] = useState(false);
  const [errorConflicto, setErrorConflicto] = useState('');

  const camposValidos = nombre.trim() && codigo.trim();
  const esEdicion = !!proveedor;
  const titulo = esEdicion ? 'Editar proveedor' : 'Nuevo proveedor';

  function handleConfirm() {
    const result = onGuardar({
      nombre: nombre.trim(),
      codigo: codigo.trim(),
      origenPredeterminado: origenPredeterminado.trim(),
      contactoNombre: contactoNombre.trim(),
      contactoTelefono: contactoTelefono.trim(),
      contactoCorreo: contactoCorreo.trim(),
      lineaTransporteHabitual,
      notas: notas.trim() || undefined,
    });
    setConfirmar(false);
    if (!result.ok) {
      setErrorConflicto(result.motivo);
      return;
    }
    toast.success(
      esEdicion ? 'Proveedor actualizado' : 'Proveedor creado',
      `${nombre.trim()} (${codigo.trim()})`,
    );
    requestClose();
  }

  return (
    <>
      <div
        onClick={requestClose}
        className={overlayClass}
        style={{
          position: 'fixed', inset: 0, zIndex: zIndex.modal,
          backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          className={panelClass}
          style={{
            backgroundColor: '#FFFFFF', borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.20)', overflow: 'hidden',
            width: 560, maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          }}
        >
          <ModalHeader title={titulo} accentColor="#DC0202" onClose={requestClose} />
          <div style={{ padding: '24px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="grid grid-cols-2" style={{ gap: 16 }}>
              <CampoTexto label="Nombre" value={nombre} onChange={e => { setNombre(e.target.value); setErrorConflicto(''); }} />
              <CampoTexto label="Código" value={codigo} onChange={e => { setCodigo(e.target.value); setErrorConflicto(''); }} />
            </div>
            <div className="grid grid-cols-2" style={{ gap: 16 }}>
              <CampoTexto label="Origen predeterminado" value={origenPredeterminado} onChange={e => setOrigenPredeterminado(e.target.value)} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: colores.texto.formulario }}>
                  Línea de transporte habitual
                </label>
                <SelectCatalogo
                  value={lineaTransporteHabitual}
                  onChange={setLineaTransporteHabitual}
                  options={opcionesTransporte}
                  placeholder="Seleccionar línea"
                />
              </div>
            </div>
            <div className="grid grid-cols-2" style={{ gap: 16 }}>
              <CampoTexto label="Contacto" value={contactoNombre} onChange={e => setContactoNombre(e.target.value)} />
              <CampoTexto label="Teléfono" value={contactoTelefono} onChange={e => setContactoTelefono(e.target.value)} />
            </div>
            <CampoTexto label="Correo" value={contactoCorreo} onChange={e => setContactoCorreo(e.target.value)} />
            {errorConflicto && (
              <p style={{ fontSize: 13, fontWeight: 600, color: colores.status.error, margin: 0 }}>
                {errorConflicto}
              </p>
            )}
            <CampoTexto label="Notas (opcional)" value={notas} onChange={e => setNotas(e.target.value)} />
            <div className="flex justify-end" style={{ gap: 8, marginTop: 8 }}>
              <Boton variante="secundario" onClick={requestClose}>Cancelar</Boton>
              <Boton disabled={!camposValidos} onClick={() => setConfirmar(true)}>
                {esEdicion ? 'Guardar cambios' : 'Crear proveedor'}
              </Boton>
            </div>
          </div>
        </div>
      </div>

      {confirmar && (
        <ConfirmDialog
          title={esEdicion ? 'Confirmar edición' : 'Confirmar nuevo proveedor'}
          message={esEdicion
            ? `Se actualizarán los datos de "${nombre.trim()}".`
            : `Se creará el proveedor "${nombre.trim()}" con código ${codigo.trim()}.`
          }
          confirmLabel={esEdicion ? 'Guardar' : 'Crear'}
          onCancel={() => setConfirmar(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
