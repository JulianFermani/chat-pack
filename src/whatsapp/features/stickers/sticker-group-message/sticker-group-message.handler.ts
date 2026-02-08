import { Message } from 'whatsapp-web.js';
import { stickerGroupMessageSender } from './services/sticker-gm-sender.service';
import { Injectable } from '@nestjs/common';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';

@Injectable()
export class StickerGroupMessageHandler {
  constructor(private readonly whatsappClient: WhatsappService) {}
  async handle(message: Message) {
    switch (true) {
      case true:
        await stickerGroupMessageSender(message, this.whatsappClient);
    }
  }
}
