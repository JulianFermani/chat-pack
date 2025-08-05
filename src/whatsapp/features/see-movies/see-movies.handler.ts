import { Message, Client } from 'whatsapp-web.js';
import { movieFetcher } from './infra/movie-fetcher.service';
import { movieBuilderMessage } from './presenter/see-movies.presenter';

export class SeeMoviesHandler {
  static async handle(message: Message, client: Client) {
    const movies = await movieFetcher(message);

    if (movies === null || movies.length === 0) {
      await message.reply('No hay películas en cartelera en este momento.');
      return;
    }

    const messageText = movieBuilderMessage(movies);

    await client.sendMessage(
      message.from,
      `🍿 Películas en cartelera: \n${messageText}`,
    );
  }
}
