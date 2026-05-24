import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { CommandRegistry } from '@command-registry/command-registry';
import { UserSession } from '@session/user-session.interface';
import { AbstractCommand } from '@shared/interfaces/abstract-command.interface';
import { SubscribeTodaysGamesHandler } from './subscribe-todays-games.handler';

@Injectable()
export class SubscribeTodaysGamesCommand extends AbstractCommand {
  name = 'suscribirmePartidosHoy';
  description =
    'Suscribe este chat a la notificacion diaria de partidos de hoy.';
  usesSession = false;

  constructor(
    registry: CommandRegistry,
    private readonly handler: SubscribeTodaysGamesHandler,
  ) {
    super(registry);
  }

  async execute(message: Message): Promise<UserSession | void> {
    await this.handler.handle(message);
  }
}
