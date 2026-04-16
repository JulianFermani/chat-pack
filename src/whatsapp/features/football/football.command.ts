import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { CommandRegistry } from '@command-registry/command-registry';
import { UserSession } from '@session/user-session.interface';
import { AbstractCommand } from '@shared/interfaces/abstract-command.interface';
import { FootballHandler } from './football.handler';
import { FootballMenuSessionData } from './football.session';

@Injectable()
export class FootballCommand extends AbstractCommand<FootballMenuSessionData> {
  name = 'futbol';
  description = 'Muestra el submenu de futbol con acciones disponibles.';
  usesSession = true;
  firstStep = 'awaiting-action';

  constructor(
    registry: CommandRegistry,
    private readonly handler: FootballHandler,
  ) {
    super(registry);
  }

  async execute(
    message: Message,
    session: UserSession<FootballMenuSessionData>,
  ): Promise<UserSession<FootballMenuSessionData> | void> {
    return this.handler.handle(message, session);
  }
}
