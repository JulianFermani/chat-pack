import { Message, Client } from 'whatsapp-web.js';
import { Command } from './interfaces/command.interface';
import { UserSession } from '../../session/user-session.interface';
import { CommandRegistry } from 'src/whatsapp/command-registry';
import { getEmojiForCommand } from './utils/number-format.util';

export class GetCommandsCommand implements Command {
  constructor(private readonly commandRegistry: CommandRegistry) {}
  name = 'comandos';
  description =
    'Lista todos los comandos disponibles del bot y qué hace cada uno.';
  usesSession = false;

  async execute(message: Message, client: Client): Promise<UserSession | void> {
    const commandsArray = this.commandRegistry.getAll();
    const text = commandsArray
      .map((command) => {
        const emoji = getEmojiForCommand(command.name);
        return `${emoji} Comando: */${command.name}*\n📝 Descripción: ${command.description}`;
      })
      .join('\n\n');

    await client.sendMessage(
      message.from,
      `⚙️ *Comandos disponibles:*\n\n${text}`,
    );
    return;
  }
}
