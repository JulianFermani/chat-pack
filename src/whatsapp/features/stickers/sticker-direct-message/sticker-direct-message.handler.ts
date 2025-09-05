import { Message } from 'whatsapp-web.js';
import { stickerDirectMessageSender } from './services/sticker-dm-sender.service';
import { Injectable } from '@nestjs/common';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';

@Injectable()
export class StickerDirectMessageHandler {
  constructor(private readonly whatsappClient: WhatsappService) {}

  async handle(message: Message) {
    switch (true) {
      case true:
        await stickerDirectMessageSender(message, this.whatsappClient);
    }
  }
}
