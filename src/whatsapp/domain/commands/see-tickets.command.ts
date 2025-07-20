import { Message, Client } from 'whatsapp-web.js';
import { Command } from './interfaces/command.interface';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { fetchMovies } from './services/movie-fetcher.service';
import { UserMovie } from './interfaces/movie.interface';
import { SeeTicketsData } from './interfaces/see-tickets-data.interface';
import { fetchShowtimes } from './services/showtime-fetcher.service';
import { generateDateOptions, formatDate } from './utils/date-format.util';
import { UserShowtime } from './interfaces/showtime.interface';
import { buildWhatsAppShowtimesMessage } from './services/showtime-builder-message.service';
import { getEmojiNumber } from './utils/number-format.util';

export class SeeTicketsCommand implements Command {
  name = 'verEntradas';
  description =
    'Muestra las entradas vendidas para una función del cine SudCinemas Villa María según la fecha elegida por el usuario.';
  usesSession = true;

  async execute(
    message: Message,
    client: Client,
    session: UserSession<SeeTicketsData>,
  ): Promise<UserSession<SeeTicketsData> | void> {
    const userId = message.from;
    const text = message.body.trim();
    let messageText = '';
    let movies: UserMovie[] | null;
    let showtimes: UserShowtime[] | null;
    // Mostrar peliculas y solicitar selección de una
    switch (session.step) {
      case 1: {
        movies = await fetchMovies(message);

        if (movies === null || movies.length === 0) {
          await message.reply('No hay películas en cartelera en este momento.');
          return;
        }

        messageText = movies
          .map(
            (movie, index) =>
              `${getEmojiNumber(index + 1)}. ${movie.nombre}\n🎞️ Formato: ${movie.formato}\n🗣️ Lenguaje: ${movie.lenguaje}`,
          )
          .join('\n\n');

        await client.sendMessage(
          message.from,
          `🎟️ Enviá el número de la película que querés ver las entradas: \n${messageText}`,
        );
        session.data.movies = movies;
        session.step = 2;
        return session;
      }
      case 2: {
        // Buscar las funciones para esa peli y solicitar seleccion una fecha
        const movieNum = Number(text);
        const selectedMovie = session.data.movies?.[movieNum - 1];
        if (!selectedMovie) {
          await client.sendMessage(userId, 'Número inválido.');
          return session;
        }

        showtimes = await fetchShowtimes(selectedMovie.pref, message);
        if (showtimes === null || showtimes.length === 0) {
          await message.reply('No hay funciones disponibles en este momento');
          return;
        }

        const [d1, d2, d3] = generateDateOptions(
          new Date(showtimes[0].fechaHora.date),
        );

        session.data = {
          movies: movies!,
          movie: selectedMovie,
          showtimes: showtimes,
          dates: [d1, d2, d3],
        };
        session.step = 3;

        await client.sendMessage(
          userId,
          `📅 ¿Qué día querés ver la función? Elegí un número:\n${getEmojiNumber(1)}. ${formatDate(d1)}\n${getEmojiNumber(2)}. ${formatDate(d2)}\n${getEmojiNumber(3)}. ${formatDate(d1)} al ${formatDate(d3)}`,
        );
        return session;
      }
      case 3: {
        // Tomar la fecha deseada, buscar los showtimes y enviarlos al usuario
        //movies = session.data.movie;
        const showtimes: UserShowtime[] | null = session.data.showtimes;
        // ¿Es esto necesario? Teniendo en cuenta que en el anterior paso ya lo verifico
        // y no deberia llegar nunca null hasta acá..
        if (showtimes === null || showtimes.length === 0) {
          await message.reply('No hay funciones disponibles en este momento');
          return;
        }
        const dates: [Date, Date, Date] = session.data.dates;
        const dayNum = Number(text);
        if (isNaN(dayNum)) {
          await client.sendMessage(
            userId,
            'No es un número válido. Intenta de nuevo:',
          );
          return session;
        }
        let userShowtimes: UserShowtime[] = [];
        const selectDay = dates[dayNum - 1];
        // ¿Quizás sacarlo afuera a otra función?
        for (let index = 0; index < showtimes.length; index++) {
          const dateShowtime: Date = new Date(showtimes[index].fechaHora.date);
          if (dayNum === 3) {
            userShowtimes = showtimes;
            break;
          }
          if (selectDay.toDateString() === dateShowtime.toDateString()) {
            userShowtimes.push(showtimes[index]);
          }
        }
        const mensajeFinal = buildWhatsAppShowtimesMessage(userShowtimes);
        await client.sendMessage(userId, mensajeFinal);
        return;
      }

      default:
        break;
    }
    return;
  }
}
