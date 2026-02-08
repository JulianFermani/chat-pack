import { Message } from 'whatsapp-web.js';
import { holaSender } from './services/hola-sender.service';
import { Injectable } from '@nestjs/common';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';

@Injectable()
export class HolaHandler {
  constructor(private readonly whatsappClient: WhatsappService) {}

  async handle(message: Message): Promise<void> {
    await holaSender(message, this.whatsappClient);
  }
}
