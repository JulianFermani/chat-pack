import { Client, Message } from 'whatsapp-web.js';
import { stickerDirectMessageSender } from './services/sticker-dm-sender.service';

export class StickerDirectMessageHandler {
  static async handle(message: Message, client: Client) {
    switch (true) {
      case true:
        await stickerDirectMessageSender(message, client);
    }
  }
}
