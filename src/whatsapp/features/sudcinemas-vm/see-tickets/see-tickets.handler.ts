import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Client, Message } from 'whatsapp-web.js';
import { SeeTicketsData } from './see-tickets.session';
import { getUserMovie } from './services/get-user-movie.service';
import { getUserShowtime } from './services/get-user-showtime.service';
import { sendUserShowtimes } from './services/send-user-showtimes.service';

export class SeeTicketsHandler {
  static async handle(
    message: Message,
    client: Client,
    session: UserSession<SeeTicketsData>,
  ): Promise<UserSession<SeeTicketsData> | void> {
    switch (session.step) {
      case 1:
        return getUserMovie(message, client, session);
      case 2:
        return getUserShowtime(message, client, session);
      case 3:
        return sendUserShowtimes(message, client, session);
    }
  }
}
