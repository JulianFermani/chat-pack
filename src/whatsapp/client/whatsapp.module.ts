import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WhatsappService } from './whatsapp.service';
import { whatsappClientProvider } from './whatsapp.provider';
@Module({
  imports: [ConfigModule],
  providers: [WhatsappService, whatsappClientProvider],
  exports: [WhatsappService],
})
export class WhatsappModule {}
