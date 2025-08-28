import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SessionManager } from '../session/session-manager';
import { WhatsappService } from '../application/whatsapp.service';

@Injectable()
export class SessionCleaner {
  private readonly logger = new Logger(SessionCleaner.name);

  constructor(
    private readonly sessionManager: SessionManager,
    private readonly whatsappService: WhatsappService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCleanup(): Promise<void> {
    const client = this.whatsappService.getClient();
    this.logger.log('Limpieza disparada!');
    const removed = this.sessionManager.cleanInactiveSessions(5 * 60 * 1000);
    for (const userId of removed) {
      this.logger.log(`Sesión expirada para ${userId}`);
      await client.sendMessage(
        userId,
        '🚮 Tu sesión expiró por inactividad. Si querés empezar de nuevo, enviá un comando.',
      );
    }
  }
}
