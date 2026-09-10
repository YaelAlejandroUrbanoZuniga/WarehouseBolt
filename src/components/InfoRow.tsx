import { colores } from '@/kit/tokens/colores';

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex" style={{ gap: 8 }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: colores.texto.secundario, minWidth: 100 }}>{label}:</span>
      <span style={{ fontSize: 13, color: colores.texto.principal }}>{value}</span>
    </div>
  );
}
