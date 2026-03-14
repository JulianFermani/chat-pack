import { Module } from '@nestjs/common';

import { CommandHandlerService } from './command-handler.service';
import { WhatsappModule } from '@client/whatsapp.module';
import { CommandRegistryModule } from '@command-registry/command-registry.module';
import { SessionModule } from '@session/session.module';

@Module({
  imports: [WhatsappModule, SessionModule, CommandRegistryModule],
  controllers: [],
  providers: [CommandHandlerService],
  exports: [],
})
export class CommandHandlerModule {}
