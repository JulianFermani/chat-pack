import { Message } from 'whatsapp-web.js';

import { WhatsappService } from '@client/whatsapp.service';
import { seeTodaysGamesBuilderMessage } from '../presenter/see-todays-games.presenter';
import { libertadoresGamesFetcher } from './libertadores-games-fetcher.service';

export async function seeTodaysGamesSender(
  message: Message,
  whatsappClient: WhatsappService,
): Promise<void> {
  try {
    const league = await libertadoresGamesFetcher();

    if (!league || league.games.length === 0) {
      await whatsappClient.sendMessage(
        message.from,
        'Hoy no hay partidos de la Copa CONMEBOL Libertadores.',
      );
      return;
    }

    const messageText = seeTodaysGamesBuilderMessage(league);

    await whatsappClient.sendMessage(
      message.from,
      `⚽ *Partidos de hoy - ${league.name}*\n\n${messageText}`,
    );
  } catch {
    await whatsappClient.sendMessage(
      message.from,
      'No pude consultar los partidos de hoy en este momento.',
    );
  }
}
