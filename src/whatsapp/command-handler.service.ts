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
    const isGroup = message.from.endsWith('@g.us');
    const text = message.body.toLocaleLowerCase();
    const words = ['sticker', 'imagen'];
    const hasSome = words.some((word) => text.includes(word));
    let command: Command | undefined;
    this.logger.log(`isGroup: ${isGroup}`);
    if (body.startsWith('/')) {
      const [commandName] = body.slice(1).split(' ');
      this.logger.log(`commandName: ${commandName}`);
      command = this.commands.get(commandName.toLowerCase());
      if (!command) {
        await client.sendMessage(
          message.from,
          `Comando desconocido: ${commandName}`,
        );
        return;
      }
    } else if (
      message.type === MessageTypes.IMAGE ||
      message.type === MessageTypes.VIDEO ||
      (hasSome && message.hasQuotedMsg)
    ) {
      if (!isGroup) {
        command = this.commands.get('stickerdirectmessage');
      } else {
        command = this.commands.get('stickergroupmessage');
      }
    }

    try {
      if (command !== undefined) {
        await command.execute(message, client);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error ejecutando comando: ${error.message}`);
      }
      await client.sendMessage(message.from, 'Error ejecutando el comando.');
    }
  }
}
