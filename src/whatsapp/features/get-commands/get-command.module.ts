import { forwardRef, Module } from '@nestjs/common';
import { WhatsappModule } from 'src/whatsapp/application/whatsapp.module';
import { GetCommandsCommand } from './get-command.command';
import { GetCommandHandler } from './get-command.handler';

@Module({
  imports: [forwardRef(() => WhatsappModule)],
  providers: [GetCommandsCommand, GetCommandHandler],
  exports: [GetCommandsCommand],
})
export class CommandModule {}
