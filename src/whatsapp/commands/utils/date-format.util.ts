export function formatDate(date: Date): string {
  return date.toLocaleString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function generateDateOptions(base: Date): [Date, Date, Date] {
  const d1 = base;
  const d2 = new Date(base);
  const d3 = new Date(base);
  d2.setDate(base.getDate() + 1);
  d3.setDate(base.getDate() + 7);
  return [d1, d2, d3];
}
