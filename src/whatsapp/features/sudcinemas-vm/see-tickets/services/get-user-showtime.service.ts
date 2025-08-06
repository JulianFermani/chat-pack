import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Client, Message } from 'whatsapp-web.js';
import { SeeTicketsData } from '../see-tickets.session';
import { fetchShowtimes } from '../infra/fetch-showtimes';
import {
  formatDate,
  generateDateOptions,
} from 'src/whatsapp/shared/utils/date-format.util';
import { getEmojiNumber } from 'src/whatsapp/shared/utils/number-format.util';

export async function getUserShowtime(
  message: Message,
  client: Client,
  session: UserSession<SeeTicketsData>,
) {
  // Buscar las funciones para esa peli y solicitar seleccion una fecha
  const movieNum = Number(message.body.trim());
  const selectedMovie = session.data.movies?.[movieNum - 1];
  if (!selectedMovie) {
    await client.sendMessage(message.from, 'Número inválido.');
    return session;
  }

  const showtimes = await fetchShowtimes(selectedMovie.pref, message);
  if (showtimes === null || showtimes.length === 0) {
    await message.reply('No hay funciones disponibles en este momento');
    return;
  }

  const [d1, d2, d3] = generateDateOptions(
    new Date(showtimes[0].fechaHora.date),
  );

  session.data = {
    movies: session.data.movies,
    movie: selectedMovie,
    showtimes: showtimes,
    dates: [d1, d2, d3],
  };
  session.step = 3;

  await client.sendMessage(
    message.from,
    `📅 ¿Qué día querés ver la función? Elegí un número:\n${getEmojiNumber(1)}. ${formatDate(d1)}\n${getEmojiNumber(2)}. ${formatDate(d2)}\n${getEmojiNumber(3)}. ${formatDate(d1)} al ${formatDate(d3)}`,
  );
  return session;
}
