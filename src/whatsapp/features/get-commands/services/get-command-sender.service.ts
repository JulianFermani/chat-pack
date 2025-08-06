import { CommandRegistry } from 'src/whatsapp/command-registry';
import { Client, Message } from 'whatsapp-web.js';
import { getCommandBuilderMessage } from '../presenter/get-commands.presenter';

export async function getCommandSender(
  message: Message,
  client: Client,
  commandRegistry: CommandRegistry,
): Promise<void> {
  const commandsArray = commandRegistry.getAll();

  const messageText = getCommandBuilderMessage(commandsArray);

  await client.sendMessage(
    message.from,
    `⚙️ *Comandos disponibles:*\n\n${messageText}`,
  );
  return;
}
