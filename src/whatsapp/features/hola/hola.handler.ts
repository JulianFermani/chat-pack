import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { holaSender } from './services/hola-sender.service';
import { WhatsappService } from '@client/whatsapp.service';

@Injectable()
export class HolaHandler {
  constructor(private readonly whatsappClient: WhatsappService) {}

  async handle(message: Message): Promise<void> {
    await holaSender(message, this.whatsappClient);
  }
}
