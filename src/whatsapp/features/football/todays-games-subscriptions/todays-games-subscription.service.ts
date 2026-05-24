import { Injectable } from '@nestjs/common';

import { SubscriptionService } from '@application/subscriptions/subscription.service';
import { DAILY_FOOTBALL_GAMES_TOPIC } from '@application/subscriptions/subscription.constants';

@Injectable()
export class TodaysGamesSubscriptionService {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  async subscribeChat(chatId: string): Promise<string> {
    const result = await this.subscriptionService.subscribe(
      chatId,
      DAILY_FOOTBALL_GAMES_TOPIC,
      this.getChatType(chatId),
    );

    if (result === 'already-active') {
      return 'Ya estabas suscripto a la notificacion diaria de partidos de hoy.';
    }

    if (result === 'reactivated') {
      return 'Volviste a suscribirte. Todos los dias a las 00:00 te voy a avisar los partidos de hoy en este chat.';
    }

    return 'Listo. Todos los dias a las 00:00 te voy a avisar los partidos de hoy en este chat.';
  }

  async unsubscribeChat(chatId: string): Promise<string> {
    const result = await this.subscriptionService.unsubscribe(
      chatId,
      DAILY_FOOTBALL_GAMES_TOPIC,
    );

    if (result === 'not-active') {
      return 'No tenias una suscripcion activa de partidos de hoy en este chat.';
    }

    return 'Listo. Ya no voy a enviarte la notificacion diaria de partidos de hoy en este chat.';
  }

  async findSubscribers() {
    return this.subscriptionService.findActiveByTopic(
      DAILY_FOOTBALL_GAMES_TOPIC,
    );
  }

  private getChatType(chatId: string): 'private' | 'group' {
    return chatId.endsWith('@g.us') ? 'group' : 'private';
  }
}
