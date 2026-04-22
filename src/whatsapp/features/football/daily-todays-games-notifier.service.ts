import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { SeeTodaysGamesService } from './see-todays-games/services/see-todays-games.service';
import { TodaysGamesSubscriptionService } from './todays-games-subscription.service';

@Injectable()
export class DailyTodaysGamesNotifierService {
  private readonly logger = new Logger(DailyTodaysGamesNotifierService.name);

  constructor(
    private readonly seeTodaysGamesService: SeeTodaysGamesService,
    private readonly todaysGamesSubscriptionService: TodaysGamesSubscriptionService,
  ) {}

  @Cron('0 0 * * *', { timeZone: 'America/Argentina/Buenos_Aires' })
  async notifySubscribers(): Promise<void> {
    const subscriptions =
      await this.todaysGamesSubscriptionService.findSubscribers();

    if (subscriptions.length === 0) {
      return;
    }

    const messageText =
      await this.seeTodaysGamesService.buildTodaysGamesSummary();

    for (const subscription of subscriptions) {
      try {
        await this.seeTodaysGamesService.sendPrebuiltSummary(
          subscription.chatId,
          messageText,
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'unknown error';

        this.logger.error(
          `No pude enviar la notificacion diaria a ${subscription.chatId}: ${errorMessage}`,
        );
      }
    }
  }
}
