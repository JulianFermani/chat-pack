import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { SeeTicketsData } from '../see-tickets.session';
import { Message } from 'whatsapp-web.js';
import {
  buildShowtimesMessage,
  showtimesFilter,
} from '../presenter/see-tickets.presenter';
import { backOrDelete } from 'src/whatsapp/shared/utils/back-or-delete-message.util';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';

export async function sendUserShowtimes(
  message: Message,
  whatsappClient: WhatsappService,
  session: UserSession<SeeTicketsData>,
): Promise<UserSession<SeeTicketsData> | void> {
  // Tomar la fecha deseada, buscar los showtimes y enviarlos al usuario
  //movies = session.data.movie;
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
    await whatsappClient.sendMessage(
      message.from,
      'No es un número válido. Intenta de nuevo:',
    );
    return session;
  }

  const daySelected = dates[dayNum - 1];
  const userShowtimes = showtimesFilter(dayNum, daySelected, showtimes);
  let mensajeFinal = buildShowtimesMessage(userShowtimes);
  mensajeFinal = backOrDelete(mensajeFinal);
  await whatsappClient.sendMessage(message.from, mensajeFinal);
  session.step = 4;
  return session;
}
