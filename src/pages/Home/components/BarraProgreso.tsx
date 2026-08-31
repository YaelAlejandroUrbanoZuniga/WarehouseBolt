import { colores } from '@/kit/tokens/colores';

export interface ItemBarra {
  etiqueta: string;
  valor: number;
  color: string;
}

interface Props {
  items: ItemBarra[];
  total: number;
}

export function BarraProgreso({ items, total }: Props) {
  if (items.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item) => (
        <div key={item.etiqueta} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: colores.texto.secundario,
              width: 140,
              flexShrink: 0,
            }}
          >
            {item.etiqueta}
          </span>
          <div
            style={{
              flex: 1,
              backgroundColor: colores.superficie.hoverFila,
              height: 8,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: total > 0 ? `${(item.valor / total) * 100}%` : '0%',
                backgroundColor: item.color,
                height: '100%',
                borderRadius: 4,
                transition: 'width 300ms',
              }}
            />
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: colores.texto.principal,
              width: 32,
              textAlign: 'right',
              flexShrink: 0,
            }}
          >
            {item.valor}
          </span>
        </div>
      ))}
    </div>
  );
}
