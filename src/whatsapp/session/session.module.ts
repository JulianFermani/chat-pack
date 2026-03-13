import { forwardRef, Module } from '@nestjs/common';

import { SessionCleaner } from './session-cleaner';
import { SessionManager } from './session-manager';
import { WhatsappModule } from '@application/whatsapp.module';

@Module({
  imports: [forwardRef(() => WhatsappModule)],
  providers: [SessionManager, SessionCleaner],
  exports: [SessionCleaner, SessionManager],
})
export class SessionModule {}
