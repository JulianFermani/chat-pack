import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { seeTodaysGamesSender } from './services/see-todays-games-sender.service';
import { WhatsappService } from '@client/whatsapp.service';

@Injectable()
export class SeeTodaysGamesHandler {
  constructor(private readonly whatsappClient: WhatsappService) {}

  async handle(message: Message): Promise<void> {
    switch (true) {
      case true:
        return seeTodaysGamesSender(message, this.whatsappClient);
    }
  }
}
