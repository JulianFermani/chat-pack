import { Message, Client } from 'whatsapp-web.js';
import { Command } from './interfaces/command.interface';
import { UserSession } from '../../session/user-session.interface';
import { fetchMovies } from './services/movie-fetcher.service';
import { getEmojiNumber } from './utils/number-format.util';

export class SeeMoviesCommand implements Command {
  name = 'verPeliculas';
  description =
    'Muestra todas las películas en cartelera del cine SudCinemas Villa María.';
  usesSession = false;

  async execute(message: Message, client: Client): Promise<UserSession | void> {
    const movies = await fetchMovies(message);

    if (movies === null || movies.length === 0) {
      await message.reply('No hay películas en cartelera en este momento.');
      return;
    }

    const messageText = movies
      .map(
        (movie, index) =>
          `${getEmojiNumber(index + 1)}. ${movie.nombre}\n🎞️ Formato: ${movie.formato}\n🗣️ Lenguaje: ${movie.lenguaje}`,
      )
      .join('\n\n');

    await client.sendMessage(
      message.from,
      `🍿 Películas en cartelera: \n${messageText}`,
    );
    return;
  }
}
