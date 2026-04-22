import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { SeeTicketsHandler } from './see-tickets.handler';
import { SeeTicketsData } from './see-tickets.session';
import { CommandRegistry } from '@command-registry/command-registry';
import { UserSession } from '@session/user-session.interface';
import { AbstractCommand } from '@shared/interfaces/abstract-command.interface';
import { SeeTicketsEnumCommand } from './enum/commands.enum';

@Injectable()
export class SeeTicketsCommand extends AbstractCommand {
  name = 'verEntradas';
  description =
    'Muestra las entradas vendidas para una función del cine SudCinemas Villa María según la fecha elegida por el usuario.';
  usesSession = true;
  firstStep = SeeTicketsEnumCommand.GET_USER_MOVIE_STATE;

  constructor(
    registry: CommandRegistry,
    private readonly handler: SeeTicketsHandler,
  ) {
    super(registry);
  }

  async execute(
    message: Message,
    session: UserSession<SeeTicketsData>,
  ): Promise<UserSession<SeeTicketsData> | void> {
    return this.handler.handle(message, session);
  }
}
