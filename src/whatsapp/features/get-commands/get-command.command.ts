import { Message, Client } from 'whatsapp-web.js';
import { Command } from 'src/whatsapp/shared/interfaces/command.interface';
import { UserSession } from '../../session/user-session.interface';
import { CommandRegistry } from 'src/whatsapp/command-registry';
import { GetCommandHandler } from './get-command.handler';

export class GetCommandsCommand implements Command {
  constructor(private readonly commandRegistry: CommandRegistry) {}
  name = 'comandos';
  description =
    'Lista todos los comandos disponibles del bot y qué hace cada uno.';
  usesSession = false;

  async execute(message: Message, client: Client): Promise<UserSession | void> {
    await GetCommandHandler.handle(message, client, this.commandRegistry);
  }
}
