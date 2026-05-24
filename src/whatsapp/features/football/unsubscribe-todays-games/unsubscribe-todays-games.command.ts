import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { CommandRegistry } from '@command-registry/command-registry';
import { UserSession } from '@session/user-session.interface';
import { AbstractCommand } from '@shared/interfaces/abstract-command.interface';
import { UnsubscribeTodaysGamesHandler } from './unsubscribe-todays-games.handler';

@Injectable()
export class UnsubscribeTodaysGamesCommand extends AbstractCommand {
  name = 'desuscribirmePartidosHoy';
  description =
    'Desuscribe este chat de la notificacion diaria de partidos de hoy.';
  usesSession = false;

  constructor(
    registry: CommandRegistry,
    private readonly handler: UnsubscribeTodaysGamesHandler,
  ) {
    super(registry);
  }

  async execute(message: Message): Promise<UserSession | void> {
    await this.handler.handle(message);
  }
}
