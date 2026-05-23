import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { WhatsappService } from '@client/whatsapp.service';
import { TinCardService } from './tin-card.service';

@Injectable()
export class ShowTinHandler {
  constructor(
    private readonly whatsapp: WhatsappService,
    private readonly tinCardService: TinCardService,
  ) {}

  async handle(message: Message): Promise<void> {
    if (message.from.endsWith('@g.us')) {
      await this.whatsapp.sendMessage(
        message.from,
        '🔒 Este comando solo se puede usar en chats privados.',
      );
      return;
    }

    const tin = await this.tinCardService.findTinByChatId(message.from);
    if (!tin) {
      await this.whatsapp.sendMessage(
        message.from,
        '💳 No tenes una tarjeta registrada. Usa */registrarTin 1596322*.',
      );
      return;
    }

    await this.whatsapp.sendMessage(
      message.from,
      `💳 Tu numero de tarjeta TIN registrado es: ${tin}`,
    );
  }
}
