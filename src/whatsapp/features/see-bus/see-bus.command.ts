import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { SeeBusHandler } from './see-bus.handler';
import { SeeBusesData } from './see-bus.session';
import { CommandRegistry } from '@application/command-registry';
import { UserSession } from '@session/user-session.interface';
import { AbstractCommand } from '@shared/interfaces/abstract-command.interface';
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
