import { Client, Message } from 'whatsapp-web.js';
import { stickerGroupMessageSender } from './services/sticker-gm-sender.service';

export class StickerGroupMessageHandler {
  static async handle(message: Message, client: Client) {
    switch (true) {
      case true:
        await stickerGroupMessageSender(message, client);
    }
  }
}
