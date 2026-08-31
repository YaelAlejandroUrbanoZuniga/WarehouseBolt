export function formatearDuracion(desde: string, ahora: Date): string {
  const diff = ahora.getTime() - new Date(desde).getTime();
  const totalMin = Math.max(0, Math.floor(diff / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m}m`;
}

export function formatMinutos(minutos: number): string {
  const abs = Math.abs(minutos);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}
