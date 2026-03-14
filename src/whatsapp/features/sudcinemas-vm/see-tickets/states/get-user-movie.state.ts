import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { SeeTicketsData } from '../see-tickets.session';
import { WhatsappService } from '@client/whatsapp.service';
import { UserSession } from '@session/user-session.interface';
import { movieFetcher } from '@features/sudcinemas-vm/shared/services/movie-fetcher.service';
import { movieBuilderMessage } from '@features/sudcinemas-vm/shared/presenter/see-movies.presenter';
import { State } from '@shared/interfaces/state.interface';
import { backOrDelete } from '@shared/utils/back-or-delete-message.util';

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
