import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message } from 'whatsapp-web.js';
import { SeeBusesData } from './see-bus.session';
import { SeeBusHandler } from './see-bus.handler';
import { AbstractCommand } from 'src/whatsapp/shared/interfaces/abstract-command.interface';
import { CommandRegistry } from 'src/whatsapp/application/command-registry';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SeeBusCommand extends AbstractCommand {
  name = 'verColectivos';
  description =
    'Muestra los horarios disponibles del servicio de colectivos Villa del Rosario (todas sus líneas) y, si se detecta ubicación GPS, permite visualizarla.';
  usesSession = true;

  constructor(
    registry: CommandRegistry,
    private readonly handler: SeeBusHandler,
  ) {
    super(registry);
  }

  async execute(
    message: Message,
    session: UserSession<SeeBusesData>,
  ): Promise<UserSession | void> {
    return this.handler.handle(message, session);
  }
}
