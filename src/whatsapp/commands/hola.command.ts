import { Message, Client } from 'whatsapp-web.js';
import { Command } from './command.interface';
import { UserSession } from './usersession.interface';

export class HolaCommand implements Command {
  name = 'hola';
  description = 'Responde con un saludo';

  async execute(
    message: Message,
    client: Client,
    session: UserSession,
  ): Promise<UserSession | null> {
    await client.sendMessage(message.from, '¡Hola! Soy tu bot.');
    return null;
  }
}
