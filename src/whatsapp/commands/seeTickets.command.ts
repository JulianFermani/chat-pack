import { Message, Client } from 'whatsapp-web.js';
import { Command } from './interfaces/command.interface';
import { getMovies } from './lookForMovies.command';
import { Movie } from './interfaces/movie.interface';
import { fetchShowtimes } from './services/showtime-fetcher.service';
import { formatDate, generateDateOptions } from './utils/date-format.util';
import { Showtime } from './interfaces/showtime.interface';
import { SeeTicketsSession } from './session/user-session.types';

export class SeeTickets implements Command {
  name = 'verEntradas';
  description =
    'Permite ver las entradas vendidas de cada función en el cine de sudcinemas villa maria según la fecha deseada';

  async execute(
    message: Message,
    client: Client,
    session: SeeTicketsSession,
  ): Promise<SeeTicketsSession | null> {
    const userId = message.from;
    const text = message.body.trim();
    let messageText = '';
    const url = 'https://apiv2.gaf.adro.studio/nowPlaying/29';
    let movies: Movie[];
    switch (session.step) {
      // Mostrar peliculas y solicitar selección de una
      case 1: {
        movies = await getMovies(url, message);
        messageText = movies!
          .map(
            (movie, index) =>
              `${index + 1}. *${movie.nombre}*\nFormato: ${movie.formato}\nLenguaje: ${movie.lenguaje}`,
          )
          .join('\n\n');

        await client.sendMessage(
          message.from,
          `*Envie el número de película que desea ver las entradas* \n${messageText}`,
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

        const showtimes = await fetchShowtimes(selectedMovie.pref, message);
        const [d1, d2, d3] = generateDateOptions(
          new Date(showtimes![0].fechaHora.date),
        );

        session.data = { movie: selectedMovie, showtimes, dates: [d1, d2, d3] };
        session.step = 3;

        await client.sendMessage(
          userId,
          `*¿Qué día?*\n1. ${formatDate(d1)}\n2. ${formatDate(d2)}\n3. Semana completa`,
        );
        return session;
      }
      case 3: {
        // Tomar la fecha deseada, buscar los showtimes y enviarlos al usuario
        movies = session.data.movie;
        const showtimes: Showtime[] = session.data.showtimes;
        const dates: [Date, Date, Date] = session.data.dates;
        const dayNum = Number(text);
        if (isNaN(dayNum)) {
          await client.sendMessage(
            userId,
            'No es un número válido. Intenta de nuevo:',
          );
          return session;
        }
        let userShowtimes: Showtime[] = [];
        const selectDay = dates[dayNum - 1];
        console.log(`Select day: ${selectDay.toString()}`);
        for (let index = 0; index < showtimes.length; index++) {
          const dateShowtime: Date = new Date(showtimes[index].fechaHora.date);
          console.log(
            `dateShowTime index[${index}]: ${dateShowtime.toString()}`,
          );
          if (dayNum === 3) {
            userShowtimes = showtimes;
            break;
          }
          if (selectDay.toDateString() === dateShowtime.toDateString()) {
            userShowtimes.push(showtimes[index]);
          }
        }
        console.log(userShowtimes);

        return null;
      }

      default:
        return session;
    }
  }
}
