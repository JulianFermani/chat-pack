import { forwardRef, Module } from '@nestjs/common';
import { WhatsappModule } from 'src/whatsapp/application/whatsapp.module';
import { SumarDosNumerosCommand } from './sumar-dos-numeros.command';
import { SumarDosNumerosHandler } from './sumar-dos-numeros.handler';
import { SumarDosNumerosStateFactory } from './states/sumar-dos-numeros-state.factory';
import { FirstNumberState } from './states/first-number.state';
import { SecondNumberState } from './states/second-number.state';
import { AddTwoNumbersState } from './states/add-two-numbers.state';

@Module({
  imports: [forwardRef(() => WhatsappModule)],
  providers: [
    SumarDosNumerosCommand,
    SumarDosNumerosHandler,
    SumarDosNumerosStateFactory,
    FirstNumberState,
    SecondNumberState,
    AddTwoNumbersState,
  ],
  exports: [SumarDosNumerosCommand],
})
export class SumarDosNumerosModule {}
