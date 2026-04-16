import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { WhatsappService } from '@client/whatsapp.service';
import { UserSession } from '@session/user-session.interface';
import { FootballMenuPresenter } from './presenter/football-menu.presenter';
import { FootballMenuSessionData } from './football.session';
import { SeeTodaysGamesService } from './see-todays-games/services/see-todays-games.service';
import { TodaysGamesSubscriptionService } from './todays-games-subscription.service';

@Injectable()
export class FootballHandler {
  constructor(
    private readonly whatsappClient: WhatsappService,
    private readonly menuPresenter: FootballMenuPresenter,
    private readonly seeTodaysGamesService: SeeTodaysGamesService,
    private readonly todaysGamesSubscriptionService: TodaysGamesSubscriptionService,
  ) {}

  async handle(
    message: Message,
    session: UserSession<FootballMenuSessionData>,
  ): Promise<UserSession<FootballMenuSessionData> | void> {
    const normalizedText = message.body.trim().toLowerCase();

    if (normalizedText === '/futbol' || !session.data.selectedAction) {
      await this.whatsappClient.sendMessage(
        message.from,
        this.menuPresenter.build(),
      );

      return {
        ...session,
        data: {
          ...session.data,
          selectedAction: 'awaiting-input',
        },
      };
    }

    if (normalizedText === '1' || normalizedText === '/verpartidoshoy') {
      await this.seeTodaysGamesService.sendTodaysGamesSummary(message.from);
      return;
    }

    if (
      normalizedText === '2' ||
      normalizedText === '/suscribirmepartidoshoy'
    ) {
      const response = await this.todaysGamesSubscriptionService.subscribeChat(
        message.from,
      );
      await this.whatsappClient.sendMessage(message.from, response);
      return;
    }

    if (
      normalizedText === '3' ||
      normalizedText === '/desuscribirmepartidoshoy'
    ) {
      const response =
        await this.todaysGamesSubscriptionService.unsubscribeChat(message.from);
      await this.whatsappClient.sendMessage(message.from, response);
      return;
    }

    await this.whatsappClient.sendMessage(
      message.from,
      'Opcion invalida. Responde con 1, 2, 3, /verPartidosHoy, /suscribirmePartidosHoy o /desuscribirmePartidosHoy. Envia 99 para salir.',
    );

    return session;
  }
}
