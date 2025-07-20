import { Message, Client } from 'whatsapp-web.js';
import { Command } from './interfaces/command.interface';
import { UserSession } from 'src/whatsapp/session/user-session.interface';

export class HolaCommand implements Command {
  name = 'hola';
  description = 'Responde con un saludo.';
  usesSession = false;

  async execute(message: Message, client: Client): Promise<UserSession | void> {
    await client.sendMessage(message.from, '¡Hola! Soy tu bot.');
    return;
  }
}
