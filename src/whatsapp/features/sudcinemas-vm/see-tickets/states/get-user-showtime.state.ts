import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { fetchShowtimes } from '../infra/fetch-showtimes';
import { SeeTicketsData } from '../see-tickets.session';
import { WhatsappService } from '@application/whatsapp.service';
import { UserMovie } from '@features/sudcinemas-vm/see-movies/model/see-movie-movie.interface';
import { UserSession } from '@session/user-session.interface';
import { State } from '@shared/interfaces/state.interface';
import { backOrDelete } from '@shared/utils/back-or-delete-message.util';
import {
  generateDateOptions,
  formatDate,
} from '@shared/utils/date-format.util';
import { getEmojiNumber } from '@shared/utils/number-format.util';

@Injectable()
export class GetUserShowtimeState implements State<SeeTicketsData> {
  readonly stepId = 2;
  constructor(private readonly whatsapp: WhatsappService) {}
  async handle(
    message: Message,
    session: UserSession<SeeTicketsData>,
  ): Promise<void | UserSession<SeeTicketsData>> {
    // Buscar las funciones para esa peli y solicitar seleccion una fecha
    let selectedMovie: UserMovie;
    if (session.data.movie && session.back === true) {
      selectedMovie = session.data.movie;
    } else {
      const movieNum = Number(message.body.trim());
      selectedMovie = session.data.movies?.[movieNum - 1];
    }
    if (!selectedMovie) {
      await this.whatsapp.sendMessage(message.from, 'Número inválido.');
      return session;
    }

    const showtimes = await fetchShowtimes(selectedMovie.pref, message);
    if (showtimes === null || showtimes.length === 0) {
      await message.reply('No hay funciones disponibles en este momento');
      return;
    }

    const [d1, d2, d3] = generateDateOptions(
      new Date(showtimes[0].fechaHora.date),
    );

    session.data = {
      movies: session.data.movies,
      movie: selectedMovie,
      showtimes: showtimes,
      dates: [d1, d2, d3],
    };
    session.step = 3;

    let messageText = `📅 ¿Qué día querés ver la función? Elegí un número:\n${getEmojiNumber(1)}. ${formatDate(d1)}\n${getEmojiNumber(2)}. ${formatDate(d2)}\n${getEmojiNumber(3)}. ${formatDate(d1)} al ${formatDate(d3)}`;
    messageText = backOrDelete(messageText);

    await this.whatsapp.sendMessage(message.from, messageText);
    session.back = false;
    return session;
  }
}
