import { Module } from '@nestjs/common';
import { CommandRegistry } from './command-registry';
import { baseCommandList } from './base-commands';
import { GetCommandsCommand } from './features/get-commands/get-command.command';

@Module({
  providers: [
    {
      provide: CommandRegistry,
      useFactory: () => {
        const registry = new CommandRegistry();

        // Primero los comandos sin dependencias
        baseCommandList.forEach((cmd) => registry.register(cmd));

        // Luego el que necesita el registry
        registry.register(new GetCommandsCommand(registry));

        return registry;
      },
    },
  ],
  exports: [CommandRegistry],
})
export class CommandModule {}
