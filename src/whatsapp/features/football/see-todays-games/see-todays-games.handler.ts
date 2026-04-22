import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { WhatsappService } from '@client/whatsapp.service';
import { SeeTodaysGamesService } from './services/see-todays-games.service';

@Injectable()
export class SeeTodaysGamesHandler {
  constructor(
    private readonly whatsappClient: WhatsappService,
    private readonly seeTodaysGamesService: SeeTodaysGamesService,
  ) {}

  async handle(message: Message): Promise<void> {
    switch (true) {
      case true:
        await this.seeTodaysGamesService.sendTodaysGamesSummary(message.from);
        await this.whatsappClient.sendSeen(message.from);
        return;
    }
  }
}
