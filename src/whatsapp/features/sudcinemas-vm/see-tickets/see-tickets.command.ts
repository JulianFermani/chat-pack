import { Message } from 'whatsapp-web.js';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { SeeTicketsData } from './see-tickets.session';
import { SeeTicketsHandler } from './see-tickets.handler';
import { AbstractCommand } from 'src/whatsapp/shared/interfaces/abstract-command.interface';
import { CommandRegistry } from 'src/whatsapp/application/command-registry';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SeeTicketsCommand extends AbstractCommand {
  name = 'verEntradas';
  description =
    'Muestra las entradas vendidas para una función del cine SudCinemas Villa María según la fecha elegida por el usuario.';
  usesSession = true;

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
