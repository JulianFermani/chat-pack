import { Module } from '@nestjs/common';

import { SubscriptionsModule } from '@application/subscriptions/subscriptions.module';
import { WhatsappModule } from '@client/whatsapp.module';
import { CommandRegistryModule } from '@command-registry/command-registry.module';
import { FootballCommand } from './football.command';
import { FootballHandler } from './football.handler';
import { FootballMenuPresenter } from './presenter/football-menu.presenter';
import { SeeTodaysGamesCommand } from './see-todays-games/see-todays-games.command';
import { SeeTodaysGamesHandler } from './see-todays-games/see-todays-games.handler';
import { SeeTodaysGamesService } from './see-todays-games/services/see-todays-games.service';
import { TodaysGamesFetcherService } from './see-todays-games/services/todays-games-fetcher.service';
import { SubscribeTodaysGamesCommand } from './subscribe-todays-games.command';
import { SubscribeTodaysGamesHandler } from './subscribe-todays-games.handler';
import { TodaysGamesSubscriptionService } from './todays-games-subscription.service';
import { UnsubscribeTodaysGamesCommand } from './unsubscribe-todays-games.command';
import { UnsubscribeTodaysGamesHandler } from './unsubscribe-todays-games.handler';
import { DailyTodaysGamesNotifierService } from './daily-todays-games-notifier.service';

@Module({
  imports: [WhatsappModule, CommandRegistryModule, SubscriptionsModule],
  providers: [
    FootballCommand,
    FootballHandler,
    FootballMenuPresenter,
    SeeTodaysGamesCommand,
    SeeTodaysGamesHandler,
    SeeTodaysGamesService,
    TodaysGamesFetcherService,
    SubscribeTodaysGamesCommand,
    SubscribeTodaysGamesHandler,
    TodaysGamesSubscriptionService,
    UnsubscribeTodaysGamesCommand,
    UnsubscribeTodaysGamesHandler,
    DailyTodaysGamesNotifierService,
  ],
})
export class FootballModule {}
