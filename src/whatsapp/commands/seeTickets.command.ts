import { Message, Client } from 'whatsapp-web.js';
import { Command } from './interfaces/command.interface';
import { UserSession } from './interfaces/usersession.interface';
import { getMovies } from './lookForMovies.command';
import { Movie } from './interfaces/movie.interface';

export class SeeTickets implements Command {
  name = 'verEntradas';
  description =
    'Permite ver las entradas vendidas de cada función en el cine de sudcinemas villa maria según la fecha deseada';

  async execute(
    message: Message,
    client: Client,
    session: UserSession,
  ): Promise<UserSession | null> {
    const userId = message.from;
    const text = message.body.trim();
    let url = 'https://apiv2.gaf.adro.studio/nowPlaying/29';
    let movies: Movie[] | null | undefined;
    switch (session.step) {
      // Mostrar peliculas y solicitar selección de una
      case 1: {
        movies = await getMovies(url, message);
        const messageText = movies!
          .map(
            (movie, index) =>
              `${index + 1}. *${movie.nombre}*\nFormato: ${movie.formato}\nLenguaje: ${movie.lenguaje}`,
          )
          .join('\n\n');

        await client.sendMessage(
          message.from,
          `*Envie el número de película que desea ver las entradas* \n${messageText}`,
        );
        session.step = 2;
        return session;
      }

      default:
        return session;
    }
  }
}
