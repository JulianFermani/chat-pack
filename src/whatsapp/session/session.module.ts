import { Module } from '@nestjs/common';

import { SessionCleaner } from './session-cleaner';
import { SessionManager } from './session-manager';
import { WhatsappModule } from '@client/whatsapp.module';

@Module({
  imports: [WhatsappModule],
  providers: [SessionManager, SessionCleaner],
  exports: [SessionCleaner, SessionManager],
})
export class SessionModule {}
