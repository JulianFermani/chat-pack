import { Message, Client } from 'whatsapp-web.js';
import { Command } from 'src/whatsapp/shared/interfaces/command.interface';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { HolaHandler } from './hola.handler';

export class HolaCommand implements Command {
  name = 'hola';
  description = 'Responde con un saludo.';
  usesSession = false;

  async execute(message: Message, client: Client): Promise<UserSession | void> {
    await HolaHandler.handle(message, client);
  }
}
