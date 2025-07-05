import { Message, Client } from 'whatsapp-web.js';
import { Command } from './command.interface';

export class HolaCommand implements Command {
  name = 'hola';
  description = 'Responde con un saludo';

  async execute(message: Message, client: Client) {
    await client.sendMessage(message.from, '¡Hola! Soy tu bot.');
  }
}
