import { State } from 'src/whatsapp/shared/interfaces/state.interface';
import { SeeTicketsData } from '../see-tickets.session';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';
import { Injectable } from '@nestjs/common';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message } from 'whatsapp-web.js';
import {
  buildShowtimesMessage,
  showtimesFilter,
} from '../presenter/see-tickets.presenter';
import { backOrDelete } from 'src/whatsapp/shared/utils/back-or-delete-message.util';

@Injectable()
export class SendUserShowtimesState implements State<SeeTicketsData> {
  readonly stepId = 3;
  constructor(private readonly whatsapp: WhatsappService) {}
  async handle(
    message: Message,
    session: UserSession<SeeTicketsData>,
  ): Promise<void | UserSession<SeeTicketsData>> {
    // Tomar la fecha deseada, buscar los showtimes y enviarlos al usuario
    const showtimes = session.data.showtimes;
    // ¿Es esto necesario? Teniendo en cuenta que en el anterior paso ya lo verifico
    // y no deberia llegar nunca null hasta acá..
    if (showtimes === null || showtimes.length === 0) {
      await message.reply('No hay funciones disponibles en este momento');
      return;
    }

    const dates = session.data.dates;
    const dayNum = Number(message.body.trim());
    if (isNaN(dayNum) || dayNum > 3 || dayNum < 0) {
      await this.whatsapp.sendMessage(
        message.from,
        'No es un número válido. Intenta de nuevo:',
      );
      return session;
    }

    const daySelected = dates[dayNum - 1];
    const userShowtimes = showtimesFilter(dayNum, daySelected, showtimes);
    let mensajeFinal = buildShowtimesMessage(userShowtimes);
    mensajeFinal = backOrDelete(mensajeFinal);
    await this.whatsapp.sendMessage(message.from, mensajeFinal);
    session.step = 4;
    return session;
  }
}
