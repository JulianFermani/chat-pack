import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { SeeTodaysGamesHandler } from './see-todays-games.handler';
import { CommandRegistry } from '@command-registry/command-registry';
import { UserSession } from '@session/user-session.interface';
import { AbstractCommand } from '@shared/interfaces/abstract-command.interface';

@Injectable()
export class SeeTodaysGamesCommand extends AbstractCommand {
  name = 'verPartidosHoy';
  description = 'Muestra todos los partidos que se juegan hoy.';
  usesSession = false;

  constructor(
    registry: CommandRegistry,
    private readonly handler: SeeTodaysGamesHandler,
  ) {
    super(registry);
  }

  async execute(message: Message): Promise<UserSession | void> {
    await this.handler.handle(message);
  }
}
