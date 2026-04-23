import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { SeeTodaysGamesService } from './services/see-todays-games.service';

@Injectable()
export class SeeTodaysGamesHandler {
  constructor(private readonly seeTodaysGamesService: SeeTodaysGamesService) {}

  async handle(message: Message): Promise<void> {
    switch (true) {
      case true:
        await this.seeTodaysGamesService.sendTodaysGamesSummary(message.from);
        return;
    }
  }
}
