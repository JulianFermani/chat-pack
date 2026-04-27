import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { WhatsappService } from '@client/whatsapp.service';
import { TinCardService } from './tin-card.service';

@Injectable()
export class RegisterTinHandler {
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

    const tin = this.extractTin(message.body);
    if (!tin) {
      await this.whatsapp.sendMessage(
        message.from,
        'Formato invalido. Usa */registrarTin EA2F1101*.',
      );
      return;
    }

    const result = await this.tinCardService.registerTin(message.from, tin);
    const responseText =
      result === 'created'
        ? `Listo. Registre tu tarjeta TIN ${tin}.`
        : `Listo. Actualice tu tarjeta TIN a ${tin}.`;

    await this.whatsapp.sendMessage(message.from, responseText);
  }

  private extractTin(messageBody: string): string | undefined {
    const parts = messageBody.trim().split(/\s+/);
    if (parts.length !== 2) {
      return;
    }

    const tin = parts[1]?.trim().toUpperCase();
    if (!tin || !/^[A-Z0-9]+$/.test(tin)) {
      return;
    }

    return tin;
  }
}
