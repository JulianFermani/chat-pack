import { State } from 'src/whatsapp/shared/interfaces/state.interface';
import { SeeTicketsData } from '../see-tickets.session';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';
import { Injectable } from '@nestjs/common';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message } from 'whatsapp-web.js';
import { movieFetcher } from '../../shared/services/movie-fetcher.service';
import { movieBuilderMessage } from '../../shared/presenter/see-movies.presenter';
import { backOrDelete } from 'src/whatsapp/shared/utils/back-or-delete-message.util';

@Injectable()
export class GetUserMovieState implements State<SeeTicketsData> {
  readonly stepId = 1;
  constructor(private readonly whatsapp: WhatsappService) {}

  async handle(
    message: Message,
    session: UserSession<SeeTicketsData>,
  ): Promise<void | UserSession<SeeTicketsData>> {
    const movies = await movieFetcher(message);

    if (movies === null || movies.length === 0) {
      await message.reply('No hay películas en cartelera en este momento.');
      return;
    }

    let messageText = movieBuilderMessage(movies);
    messageText = `🎟️ Enviá el número de la película que querés ver las entradas: \n${messageText}`;
    messageText = backOrDelete(messageText);

    await this.whatsapp.sendMessage(message.from, messageText);

    session.data.movies = movies;
    session.step = 2;
    session.back = false;
    return session;
  }
}
