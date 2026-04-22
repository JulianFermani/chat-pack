import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TelegramNotifierService } from './telegram-notifier.service';
import { WhatsappStatusMonitorService } from './whatsapp-status-monitor.service';

@Module({
  imports: [ConfigModule],
  providers: [TelegramNotifierService, WhatsappStatusMonitorService],
})
export class TelegramMonitorModule {}
