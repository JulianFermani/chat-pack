import { forwardRef, Module } from '@nestjs/common';
import { HolaCommand } from './hola.command';
import { HolaHandler } from './hola.handler';
import { WhatsappModule } from 'src/whatsapp/application/whatsapp.module';

@Module({
  imports: [forwardRef(() => WhatsappModule)],
  providers: [HolaCommand, HolaHandler],
  exports: [HolaCommand],
})
export class HolaModule {}
