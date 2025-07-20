import { UserShowtime } from '../interfaces/showtime.interface';

export function buildWhatsAppShowtimesMessage(
  showtimes: UserShowtime[],
): string {
  if (showtimes.length === 0) {
    return 'No hay funciones disponibles para ese día.';
  }

  let mensaje = `🎬 Funciones disponibles:\n\n`;

  for (const showtime of showtimes) {
    const date = new Date(showtime.fechaHora.date);

    const formatoFecha = date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const formatoHora = date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const disponibleWeb = showtime.expired ? '❌' : '✅';

    mensaje +=
      `
🗓️ ${formatoFecha} - ⏰ ${formatoHora}
🗣️ Lenguaje: ${showtime.lenguaje}
🎞️ Formato: ${showtime.formato}
💺 Vendidas: ${showtime.vendidas}
🪑 Disponibles: ${showtime.disponibles}
🔢 Máx. ventas: ${showtime.maxVentas}
🌐 Web: ${disponibleWeb}
`.trim() + '\n\n';
  }

  return mensaje.trim();
}
