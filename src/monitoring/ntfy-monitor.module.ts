import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { NtfyNotifierService } from './ntfy-notifier.service';
import { WhatsappStatusMonitorService } from './whatsapp-status-monitor.service';

@Module({
  imports: [ConfigModule],
  providers: [NtfyNotifierService, WhatsappStatusMonitorService],
})
export class NtfyMonitorModule {}
