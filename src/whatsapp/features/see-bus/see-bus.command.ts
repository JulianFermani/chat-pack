import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Command } from 'src/whatsapp/shared/interfaces/command.interface';
import { Client, Message } from 'whatsapp-web.js';
import { SeeBusesData } from './see-bus.session';
import { SeeBusHandler } from './see-bus.handler';

export class SeeBusCommand implements Command {
  name = 'verColectivos';
  description =
    'Muestra los horarios disponibles del servicio de colectivos Villa del Rosario (todas sus líneas) y, si se detecta ubicación GPS, permite visualizarla.';
  usesSession = true;

  async execute(
    message: Message,
    client: Client,
    session: UserSession<SeeBusesData>,
  ): Promise<UserSession | void> {
    return SeeBusHandler.handle(message, client, session);
  }
}
