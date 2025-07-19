import { Command } from './domain/commands/interfaces/command.interface';
import { Logger } from '@nestjs/common';

export class CommandRegistry {
  private readonly commands = new Map<string, Command>();
  private readonly logger = new Logger(CommandRegistry.name);

  register(command: Command): void {
    const name = command.name.toLowerCase();
    if (this.commands.has(name)) {
      this.logger.warn(`Comando duplicado: ${command.name}`);
      return;
    }
    this.commands.set(name, command);
    this.logger.log(`Comando registrado: ${command.name}`);
  }

  get(commandName: string): Command | undefined {
    return this.commands.get(commandName.toLowerCase());
  }

  getAll(): Command[] {
    return [...this.commands.values()];
  }
}
