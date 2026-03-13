import { Message } from 'whatsapp-web.js';

import { WhatsappService } from '@application/whatsapp.service';
import { movieBuilderMessage } from '@features/sudcinemas-vm/shared/presenter/see-movies.presenter';
import { movieFetcher } from '@features/sudcinemas-vm/shared/services/movie-fetcher.service';

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
