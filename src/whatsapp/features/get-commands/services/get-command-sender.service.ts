import { CommandRegistry } from 'src/whatsapp/application/command-registry';
import { Message } from 'whatsapp-web.js';
import { getCommandBuilderMessage } from '../presenter/get-commands.presenter';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';

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
