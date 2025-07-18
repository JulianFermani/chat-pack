import { Command } from './domain/commands/interfaces/command.interface';
import { commandList } from './domain/commands';
import { Logger } from '@nestjs/common';

export class CommandRegistry {
  private commands: Map<string, Command> = new Map();
  private readonly logger = new Logger(CommandRegistry.name);

  constructor() {
    commandList.forEach((commandInstance) => {
      this.commands.set(commandInstance.name.toLowerCase(), commandInstance);
      this.logger.log(`Comando registrado: ${commandInstance.name}`);
    });
  }

  get(commandName: string): Command | undefined {
    return this.commands.get(commandName.toLowerCase());
  }

  getAll(): Command[] {
    return Array.from(this.commands.values());
  }
}
