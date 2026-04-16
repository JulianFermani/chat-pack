import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { WhatsappService } from '@client/whatsapp.service';
import { TodaysGamesSubscriptionService } from './todays-games-subscription.service';

@Injectable()
export class UnsubscribeTodaysGamesHandler {
  constructor(
    private readonly whatsappClient: WhatsappService,
    private readonly todaysGamesSubscriptionService: TodaysGamesSubscriptionService,
  ) {}

  async handle(message: Message): Promise<void> {
    const response = await this.todaysGamesSubscriptionService.unsubscribeChat(
      message.from,
    );

    await this.whatsappClient.sendMessage(message.from, response);
  }
}
