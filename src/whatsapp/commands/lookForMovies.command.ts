import { Message, Client } from 'whatsapp-web.js';
import { Command } from './interfaces/command.interface';
import { fetchMovies } from './services/movie-fetcher.service';
import { UserSessionBase } from './session/user-session.base';

export class LookForMovies implements Command {
  name = 'verPeliculas';
  description =
    'Devuelve todas las peliculas en cartelera que hay en el cine de sudcinemas villa maria';

  async execute(message: Message, client: Client): Promise<null> {
    const movies = await fetchMovies(message);
    if (movies?.length === 0) {
      await message.reply('No hay películas en cartelera en este momento.');
      return null;
    }

    const messageText = movies!
      .map(
        (movie, index) =>
          `${index + 1}. *${movie.nombre}*\nFormato: ${movie.formato}\nLenguaje: ${movie.lenguaje}`,
      )
      .join('\n\n');

    await client.sendMessage(
      message.from,
      `*Películas en cartelera* \n${messageText}`,
    );
    return null;
  }
}
