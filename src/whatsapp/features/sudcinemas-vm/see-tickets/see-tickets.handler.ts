import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message } from 'whatsapp-web.js';
import { SeeTicketsData } from './see-tickets.session';
import { getUserMovie } from './services/get-user-movie.service';
import { getUserShowtime } from './services/get-user-showtime.service';
import { sendUserShowtimes } from './services/send-user-showtimes.service';
import { Injectable } from '@nestjs/common';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';

@Injectable()
export class SeeTicketsHandler {
  constructor(private readonly whatsappClient: WhatsappService) {}
  async handle(
    message: Message,
    session: UserSession<SeeTicketsData>,
  ): Promise<UserSession<SeeTicketsData> | void> {
    switch (session.step) {
      case 1:
        return getUserMovie(message, this.whatsappClient, session);
      case 2:
        return getUserShowtime(message, this.whatsappClient, session);
      case 3:
        return sendUserShowtimes(message, this.whatsappClient, session);
    }
  }
}
