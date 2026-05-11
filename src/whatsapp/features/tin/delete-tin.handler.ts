import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { WhatsappService } from '@client/whatsapp.service';
import { TinCardService } from './tin-card.service';

@Injectable()
export class DeleteTinHandler {
  constructor(
    private readonly whatsapp: WhatsappService,
    private readonly tinCardService: TinCardService,
  ) {}

  async handle(message: Message): Promise<void> {
    if (message.from.endsWith('@g.us')) {
      await this.whatsapp.sendMessage(
        message.from,
        'Este comando solo se puede usar en chats privados.',
      );
      return;
    }

    const result = await this.tinCardService.deleteTinByChatId(message.from);
    if (result === 'not-found') {
      await this.whatsapp.sendMessage(
        message.from,
        'No tenes una tarjeta TIN registrada para eliminar.',
      );
      return;
    }

    await this.whatsapp.sendMessage(
      message.from,
      'Listo. Elimine tu tarjeta TIN registrada.',
    );
  }
}
