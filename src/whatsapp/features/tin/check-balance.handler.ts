import { Message } from 'whatsapp-web.js';

import { Injectable, Logger } from '@nestjs/common';

import { WhatsappService } from '@client/whatsapp.service';
import { TinCardService } from './tin-card.service';
import { TinBalanceFetcherService } from './services/tin-balance-fetcher.service';

@Injectable()
export class CheckBalanceHandler {
  private readonly logger = new Logger(CheckBalanceHandler.name);

  constructor(
    private readonly whatsapp: WhatsappService,
    private readonly tinCardService: TinCardService,
    private readonly tinBalanceFetcher: TinBalanceFetcherService,
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

    try {
      const balance = await this.tinBalanceFetcher.fetchCurrentBalance(tin);

      if (!balance) {
        await this.whatsapp.sendMessage(
          message.from,
          `⚠️ No pude obtener el saldo actual de la tarjeta TIN ${tin}.`,
        );
        return;
      }

      await this.whatsapp.sendMessage(
        message.from,
        `💰 Saldo actual de tu tarjeta TIN ${tin}: ${formatTinBalance(balance)}`,
      );
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      this.logger.error(`No pude consultar el saldo de ${tin}: ${detail}`);
      await this.whatsapp.sendMessage(
        message.from,
        '❎ No pude consultar el saldo en este momento. Intenta de nuevo mas tarde.',
      );
    }
  }
}

function formatTinBalance(value: string): string {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return `$${value}`;
  }

  const [integerPart, decimalPart] = numericValue.toFixed(2).split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `$${formattedInteger},${decimalPart}`;
}
