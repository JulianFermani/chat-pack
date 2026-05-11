import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { CommandRegistry } from '@command-registry/command-registry';
import { UserSession } from '@session/user-session.interface';
import { AbstractCommand } from '@shared/interfaces/abstract-command.interface';
import { SegmentAlertEnumCommands } from './enum/commands.enum';
import { SegmentAlertHandler } from './segment-alert.handler';
import { SegmentAlertSessionData } from './segment-alert.session';

@Injectable()
export class SubscribeSegmentAlertCommand extends AbstractCommand {
  name = 'suscribirmeTramo';
  description =
    'Suscribe este chat a alertas de un tramo especifico por linea y sentido. El aviso llega cuando el coche entra en la localidad previa al destino.';
  usesSession = true;
  firstStep = SegmentAlertEnumCommands.INIT;

  constructor(
    registry: CommandRegistry,
    private readonly handler: SegmentAlertHandler,
  ) {
    super(registry);
  }

  async execute(
    message: Message,
    session: UserSession<SegmentAlertSessionData>,
  ): Promise<UserSession<SegmentAlertSessionData> | void> {
    return this.handler.handle(message, session);
  }
}
