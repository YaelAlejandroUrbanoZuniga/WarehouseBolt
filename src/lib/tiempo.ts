export function formatearDuracion(desde: string, ahora: Date): string {
  const diff = ahora.getTime() - new Date(desde).getTime();
  const totalMin = Math.max(0, Math.floor(diff / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m}m`;
}
