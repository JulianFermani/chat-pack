import { Module } from '@nestjs/common';

import { GetCommandsCommand } from './get-command.command';
import { GetCommandHandler } from './get-command.handler';
import { WhatsappModule } from '@client/whatsapp.module';
import { CommandRegistryModule } from '@command-registry/command-registry.module';

@Module({
  imports: [WhatsappModule, CommandRegistryModule],
  providers: [GetCommandsCommand, GetCommandHandler],
  exports: [GetCommandsCommand],
})
export class CommandModule {}
