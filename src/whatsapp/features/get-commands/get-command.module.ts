import { forwardRef, Module } from '@nestjs/common';

import { GetCommandsCommand } from './get-command.command';
import { GetCommandHandler } from './get-command.handler';
import { WhatsappModule } from '@application/whatsapp.module';

@Module({
  imports: [forwardRef(() => WhatsappModule)],
  providers: [GetCommandsCommand, GetCommandHandler],
  exports: [GetCommandsCommand],
})
export class CommandModule {}
