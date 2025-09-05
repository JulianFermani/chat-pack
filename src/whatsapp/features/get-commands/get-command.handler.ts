import { CommandRegistry } from 'src/whatsapp/application/command-registry';
import { Client, Message } from 'whatsapp-web.js';
import { getCommandSender } from './services/get-command-sender.service';

export class GetCommandHandler {
  static async handle(
    message: Message,
    client: Client,
    commandRegistry: CommandRegistry,
  ): Promise<void> {
    switch (true) {
      case true:
        return getCommandSender(message, client, commandRegistry);
    }
  }
}
