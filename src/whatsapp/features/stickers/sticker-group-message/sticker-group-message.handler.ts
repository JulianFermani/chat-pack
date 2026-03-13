import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { stickerGroupMessageSender } from './services/sticker-gm-sender.service';
import { WhatsappService } from '@application/whatsapp.service';

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
