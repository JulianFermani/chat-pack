import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { GetCommandHandler } from './get-command.handler';
import { UserSession } from '@session/user-session.interface';
import { AbstractCommand } from '@shared/interfaces/abstract-command.interface';
import { CommandRegistry } from '@command-registry/command-registry';

@Injectable()
export class GetCommandsCommand extends AbstractCommand {
  name = 'comandos';
  description =
    'Lista todos los comandos disponibles del bot y qué hace cada uno.';
  usesSession = false;

  constructor(
    registry: CommandRegistry,
    private readonly handler: GetCommandHandler,
  ) {
    super(registry);
  }

  async execute(message: Message): Promise<UserSession | void> {
    await this.handler.handle(message);
  }
}
