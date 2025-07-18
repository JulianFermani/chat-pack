import { Message, Client } from 'whatsapp-web.js';
import { Command } from './interfaces/command.interface';
import { UserSession } from '../../session/user-session.interface';
import { CommandRegistry } from 'src/whatsapp/command-registry';

export class GetCommandsCommand implements Command {
  constructor(private readonly commandRegistry: CommandRegistry) {}
  name = 'comandos';
  description = 'Responde con todos los comandos disponibles del bot';
  usesSession: false;

  async execute(message: Message, client: Client): Promise<UserSession | void> {
    let text = '';

    const commandsArray = this.commandRegistry.getAll();
    commandsArray.forEach((command, index) => {
      if (index === commandsArray.length - 1) {
        text += `Comando: */${command.name}* \nDescripción: ${command.description}`;
      } else {
        text += `Comando: */${command.name}* \nDescripción: ${command.description} \n\n`;
      }
    });

    await client.sendMessage(message.from, `*Comandos disponibles:* \n${text}`);
    return;
  }
}
