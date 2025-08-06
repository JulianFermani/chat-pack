import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Client, Message } from 'whatsapp-web.js';
import { SeeTicketsData } from '../see-tickets.session';
import { movieFetcher } from '../../shared/services/movie-fetcher.service';
import { movieBuilderMessage } from '../../shared/presenter/see-movies.presenter';

export async function getUserMovie(
  message: Message,
  client: Client,
  session: UserSession<SeeTicketsData>,
): Promise<UserSession<SeeTicketsData> | undefined> {
  const movies = await movieFetcher(message);

  if (movies === null || movies.length === 0) {
    await message.reply('No hay películas en cartelera en este momento.');
    return;
  }

  const messageText = movieBuilderMessage(movies);

  await client.sendMessage(
    message.from,
    `🎟️ Enviá el número de la película que querés ver las entradas: \n${messageText}`,
  );

  session.data.movies = movies;
  session.step = 2;
  return session;
}
