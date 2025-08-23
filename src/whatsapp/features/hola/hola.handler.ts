import { Client, Message } from 'whatsapp-web.js';
import { holaSender } from './services/hola-sender.service';

export class HolaHandler {
  static async handle(message: Message, client: Client): Promise<void> {
    await holaSender(message, client);
  }
}
