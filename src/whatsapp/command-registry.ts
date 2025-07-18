import { Command } from './domain/commands/interfaces/command.interface';
import * as Commands from './domain/commands';
import { Logger } from '@nestjs/common';

export class CommandRegistry {
  private commands: Map<string, Command> = new Map();
  private readonly logger = new Logger(CommandRegistry.name);

  constructor() {
    Object.values(Commands).forEach((Command) => {
      const commandInstance = new Command();
      this.commands.set(commandInstance.name.toLowerCase(), commandInstance);
      this.logger.log(`Comando registrado: ${commandInstance.name}`);
    });
  }

  get(commandName: string): Command | undefined {
    return this.commands.get(commandName.toLowerCase());
  }
}
