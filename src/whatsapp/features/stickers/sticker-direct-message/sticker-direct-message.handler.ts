import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { WhatsappService } from '@application/whatsapp.service';
import { stickerDirectMessageSender } from './services/sticker-dm-sender.service';

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
