import { Message, Client } from 'whatsapp-web.js';
import { Command } from 'src/whatsapp/shared/interfaces/command.interface';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { SeeTicketsData } from './see-tickets.session';
import { SeeTicketsHandler } from './see-tickets.handler';

export class SeeTicketsCommand implements Command {
  name = 'verEntradas';
  description =
    'Muestra las entradas vendidas para una función del cine SudCinemas Villa María según la fecha elegida por el usuario.';
  usesSession = true;

  async execute(
    message: Message,
    client: Client,
    session: UserSession<SeeTicketsData>,
  ): Promise<UserSession<SeeTicketsData> | void> {
    return SeeTicketsHandler.handle(message, client, session);
  }
}
