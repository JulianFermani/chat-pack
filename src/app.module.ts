import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp/whatsapp.service';
import { CommandHandlerService } from './whatsapp/command-handler.service';

@Module({
  imports: [],
  controllers: [],
  providers: [WhatsappService, CommandHandlerService],
})
export class AppModule {}
