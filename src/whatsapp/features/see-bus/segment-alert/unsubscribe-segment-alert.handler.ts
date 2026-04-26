import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { WhatsappService } from '@client/whatsapp.service';
import { SegmentAlertSubscriptionService } from './segment-alert-subscription.service';

@Injectable()
export class UnsubscribeSegmentAlertHandler {
  constructor(
    private readonly whatsapp: WhatsappService,
    private readonly subscriptionService: SegmentAlertSubscriptionService,
  ) {}

  async handle(message: Message): Promise<void> {
    const deactivatedCount = await this.subscriptionService.unsubscribeAllChat(
      message.from,
    );

    if (deactivatedCount === 0) {
      await this.whatsapp.sendMessage(
        message.from,
        'No tenias suscripciones activas de alertas por tramo en este chat.',
      );
      return;
    }

    await this.whatsapp.sendMessage(
      message.from,
      `Listo. Desactive ${deactivatedCount} suscripcion(es) de alertas por tramo en este chat.`,
    );
  }
}
