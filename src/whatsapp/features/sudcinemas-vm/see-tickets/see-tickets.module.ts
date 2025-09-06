import { forwardRef, Module } from '@nestjs/common';
import { WhatsappModule } from 'src/whatsapp/application/whatsapp.module';
import { SeeTicketsCommand } from './see-tickets.command';
import { SeeTicketsHandler } from './see-tickets.handler';

@Module({
  imports: [forwardRef(() => WhatsappModule)],
  providers: [SeeTicketsCommand, SeeTicketsHandler],
  exports: [SeeTicketsCommand],
})
export class SeeTicketsModule {}
