import { Message } from 'whatsapp-web.js';
import { UserSession } from '../../session/user-session.interface';
import { CommandRegistry } from 'src/whatsapp/application/command-registry';
import { GetCommandHandler } from './get-command.handler';
import { AbstractCommand } from 'src/whatsapp/shared/interfaces/abstract-command.interface';
import { Injectable } from '@nestjs/common';

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
