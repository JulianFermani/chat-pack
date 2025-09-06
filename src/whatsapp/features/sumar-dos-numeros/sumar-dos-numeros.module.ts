import { forwardRef, Module } from '@nestjs/common';
import { WhatsappModule } from 'src/whatsapp/application/whatsapp.module';
import { SumarDosNumerosCommand } from './sumar-dos-numeros.command';
import { SumarDosNumerosHandler } from './sumar-dos-numeros.handler';

@Module({
  imports: [forwardRef(() => WhatsappModule)],
  providers: [SumarDosNumerosCommand, SumarDosNumerosHandler],
  exports: [SumarDosNumerosCommand],
})
export class SumarDosNumerosModule {}
