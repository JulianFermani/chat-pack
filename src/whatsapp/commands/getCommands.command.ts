import { Message, Client } from 'whatsapp-web.js';
import { Command } from './command.interface';
import { UserSession } from './usersession.interface';
import * as Commands from './';

export class GetCommands implements Command {
  name = 'comandos';
  description = 'Responde con todos los comandos disponibles del bot';

  async execute(
    message: Message,
    client: Client,
    session: UserSession,
  ): Promise<UserSession | null> {
    let text = '';
    const commandsArray = Object.values(Commands);

    commandsArray.forEach((CommandClass, index) => {
      const commandInstance = new CommandClass();
      if (index === commandsArray.length - 1) {
        text += `Comando: */${commandInstance.name}* \nDescripción: ${commandInstance.description}`;
      } else {
        text += `Comando: */${commandInstance.name}* \nDescripción: ${commandInstance.description} \n\n`;
      }
    });

    await client.sendMessage(message.from, `*Comandos disponibles:* \n${text}`);
    return null;
  }
}
