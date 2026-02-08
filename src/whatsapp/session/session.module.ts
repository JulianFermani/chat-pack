import { forwardRef, Module } from '@nestjs/common';
import { SessionCleaner } from './session-cleaner';
import { WhatsappModule } from '../application/whatsapp.module';
import { SessionManager } from './session-manager';

@Module({
  imports: [forwardRef(() => WhatsappModule)],
  providers: [SessionManager, SessionCleaner],
  exports: [SessionCleaner, SessionManager],
})
export class SessionModule {}
