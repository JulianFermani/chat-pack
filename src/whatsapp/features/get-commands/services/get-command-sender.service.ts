import { Message } from 'whatsapp-web.js';

import { CommandRegistry } from '@application/command-registry';
import { WhatsappService } from '@application/whatsapp.service';
import { getCommandBuilderMessage } from '../presenter/get-commands.presenter';

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
