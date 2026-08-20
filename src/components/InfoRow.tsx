export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex" style={{ gap: 8 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#484848', minWidth: 100 }}>{label}:</span>
      <span style={{ fontSize: 13, color: '#000000' }}>{value}</span>
    </div>
  );
}
