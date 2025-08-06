import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { SeeTicketsData } from '../see-tickets.session';
import { Client, Message } from 'whatsapp-web.js';
import { UserShowtime } from '../model/see-tickets-showtimes.interface';
import {
  buildShowtimesMessage,
  showtimesFilter,
} from '../presenter/see-tickets.presenter';

export async function sendUserShowtimes(
  message: Message,
  client: Client,
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
  if (isNaN(dayNum)) {
    await client.sendMessage(
      message.from,
      'No es un número válido. Intenta de nuevo:',
    );
    return session;
  }

  const daySelected = dates[dayNum - 1];
  const userShowtimes = showtimesFilter(dayNum, daySelected, showtimes);
  const mensajeFinal = buildShowtimesMessage(userShowtimes);
  await client.sendMessage(message.from, mensajeFinal);
  return;
}
