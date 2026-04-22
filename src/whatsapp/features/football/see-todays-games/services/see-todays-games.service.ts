import { Injectable } from '@nestjs/common';

import { WhatsappService } from '@client/whatsapp.service';
import { buildTodaysGamesMessage } from '../presenter/see-todays-games.presenter';
import { TodaysGamesFetcherService } from './todays-games-fetcher.service';

@Injectable()
export class SeeTodaysGamesService {
  constructor(
    private readonly whatsappClient: WhatsappService,
    private readonly todaysGamesFetcherService: TodaysGamesFetcherService,
  ) {}

  async sendTodaysGamesSummary(chatId: string): Promise<void> {
    const messageText = await this.buildTodaysGamesSummary();

    await this.sendPrebuiltSummary(chatId, messageText);
  }

  async sendPrebuiltSummary(
    chatId: string,
    messageText: string,
  ): Promise<void> {
    await this.whatsappClient.sendMessage(chatId, messageText);
  }

  async buildTodaysGamesSummary(): Promise<string> {
    try {
      const leagues = await this.todaysGamesFetcherService.fetch();

      if (leagues.length === 0) {
        return '⚽ *Partidos de hoy*\n\nHoy no hay partidos programados.';
      }

      return `⚽ *Partidos de hoy*\n\n${buildTodaysGamesMessage(leagues)}`;
    } catch {
      return 'No pude consultar los partidos de hoy en este momento.';
    }
  }
}
