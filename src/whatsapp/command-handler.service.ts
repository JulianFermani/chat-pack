import { Injectable, Logger } from '@nestjs/common';
import { Message, Client, MessageTypes } from 'whatsapp-web.js';
import * as Commands from './commands';
import { Command } from './commands/command.interface';

@Injectable()
export class CommandHandlerService {
  private readonly logger = new Logger(CommandHandlerService.name);
  private commands: Map<string, Command> = new Map();

  constructor() {
    Object.values(Commands).forEach((CommandClass) => {
      const commandInstance = new CommandClass();
      this.registerCommand(commandInstance);
    });
  }

  registerCommand(command: Command) {
    this.commands.set(command.name.toLowerCase(), command);
    this.logger.log(`Comando registrado: ${command.name}`);
  }

  async handle(message: Message, client: Client) {
    const body = message.body.trim();
    if (
      !body.startsWith('/') &&
      message.type !== MessageTypes.IMAGE &&
      message.type !== MessageTypes.VIDEO
    )
      return;

    const isGroup = message.from.endsWith('@g.us');
    this.logger.log(`isGroup: ${isGroup}`);
    const [commandName] = body.slice(1);
    this.logger.log(`commandName: ${commandName}`);
    let command = this.commands.get(commandName.toLowerCase());
    if (!isGroup && commandName == '') {
      command = this.commands.get('stickerdirectmessage');
    } else if ((isGroup && commandName == 'ticker') || commandName == 'magen') {
      command = this.commands.get('stickergroupmessage');
    }
    if (!command) {
      await client.sendMessage(
        message.from,
        `Comando desconocido: ${commandName}`,
      );
      return;
    }

    try {
      await command.execute(message, client);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Error ejecutando comando ${commandName}: ${error.message}`,
        );
      }
      await client.sendMessage(message.from, 'Error ejecutando el comando.');
    }
  }
}
