import { forwardRef, Module } from '@nestjs/common';
import { WhatsappModule } from 'src/whatsapp/application/whatsapp.module';
import { SeeBusCommand } from './see-bus.command';
import { SeeBusHandler } from './see-bus.handler';

@Module({
  imports: [forwardRef(() => WhatsappModule)],
  providers: [SeeBusCommand, SeeBusHandler],
  exports: [SeeBusCommand],
})
export class SeeBusModule {}
