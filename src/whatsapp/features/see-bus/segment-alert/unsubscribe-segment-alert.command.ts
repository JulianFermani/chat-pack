import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { CommandRegistry } from '@command-registry/command-registry';
import { UserSession } from '@session/user-session.interface';
import { AbstractCommand } from '@shared/interfaces/abstract-command.interface';
import { UnsubscribeSegmentAlertHandler } from './unsubscribe-segment-alert.handler';

@Injectable()
export class UnsubscribeSegmentAlertCommand extends AbstractCommand {
  name = 'desuscribirmeTramos';
  description =
    'Desuscribe este chat de todas las alertas de tramos de colectivos.';
  usesSession = false;

  constructor(
    registry: CommandRegistry,
    private readonly handler: UnsubscribeSegmentAlertHandler,
  ) {
    super(registry);
  }

  async execute(message: Message): Promise<UserSession | void> {
    await this.handler.handle(message);
  }
}
