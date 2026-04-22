import { Message } from 'whatsapp-web.js';

import { getCommandBuilderMessage } from '../presenter/get-commands.presenter';
import { WhatsappService } from '@client/whatsapp.service';
import { CommandRegistry } from '@command-registry/command-registry';

export async function getCommandSender(
  message: Message,
  whatsappClient: WhatsappService,
  commandRegistry: CommandRegistry,
): Promise<void> {
  const commandsArray = commandRegistry.getAll();

  const messageText = getCommandBuilderMessage(commandsArray);

  await whatsappClient.sendMessage(
    message.from,
    `⚙️ *Comandos disponibles:*\n\n${messageText}`,
  );
  return;
}
