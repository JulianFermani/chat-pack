import { Message } from 'whatsapp-web.js';
import { movieFetcher } from '../../shared/services/movie-fetcher.service';
import { movieBuilderMessage } from '../../shared/presenter/see-movies.presenter';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';

export async function seeMovieSender(
  message: Message,
  whatsappClient: WhatsappService,
): Promise<void> {
  const movies = await movieFetcher(message);

  if (movies === null || movies.length === 0) {
    await message.reply('No hay películas en cartelera en este momento.');
    return;
  }

  const messageText = movieBuilderMessage(movies);

  await whatsappClient.sendMessage(
    message.from,
    `🍿 Películas en cartelera: \n${messageText}`,
  );
}
