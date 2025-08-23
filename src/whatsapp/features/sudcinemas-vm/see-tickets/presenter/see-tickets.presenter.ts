import { UserShowtime } from '../model/see-tickets-showtimes.interface';

export function showtimesFilter(
  dayNum: number,
  daySelected: Date,
  showtimes: UserShowtime[],
): UserShowtime[] {
  let userShowtimes: UserShowtime[] = [];
  for (let index = 0; index < showtimes.length; index++) {
    const dateShowtime: Date = new Date(showtimes[index].fechaHora.date);
    if (dayNum === 3) {
      userShowtimes = showtimes;
      break;
    }
    if (daySelected.toDateString() === dateShowtime.toDateString()) {
      userShowtimes.push(showtimes[index]);
    }
  }
  return userShowtimes;
}

export function buildShowtimesMessage(showtimes: UserShowtime[]): string {
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
