import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { CommandRegistry } from '@command-registry/command-registry';
import { UserSession } from '@session/user-session.interface';
import { AbstractCommand } from '@shared/interfaces/abstract-command.interface';
import { DeleteTinHandler } from './delete-tin.handler';

@Injectable()
export class DeleteTinCommand extends AbstractCommand {
  name = 'eliminarTin';
  description = 'Elimina la tarjeta TIN registrada en este chat.';
  usesSession = false;

  constructor(
    registry: CommandRegistry,
    private readonly handler: DeleteTinHandler,
  ) {
    super(registry);
  }

  async execute(message: Message): Promise<UserSession | void> {
    await this.handler.handle(message);
  }
}
