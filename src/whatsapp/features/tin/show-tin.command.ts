import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { CommandRegistry } from '@command-registry/command-registry';
import { UserSession } from '@session/user-session.interface';
import { AbstractCommand } from '@shared/interfaces/abstract-command.interface';
import { ShowTinHandler } from './show-tin.handler';

@Injectable()
export class ShowTinCommand extends AbstractCommand {
  name = 'verTin';
  description = 'Muestra la tarjeta TIN que tenes registrada en este chat.';
  usesSession = false;

  constructor(
    registry: CommandRegistry,
    private readonly handler: ShowTinHandler,
  ) {
    super(registry);
  }

  async execute(message: Message): Promise<UserSession | void> {
    await this.handler.handle(message);
  }
}
