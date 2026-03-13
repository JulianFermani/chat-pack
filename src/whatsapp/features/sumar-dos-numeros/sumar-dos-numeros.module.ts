import { forwardRef, Module } from '@nestjs/common';

import { AddTwoNumbersState } from './states/add-two-numbers.state';
import { FirstNumberState } from './states/first-number.state';
import { SecondNumberState } from './states/second-number.state';
import { SumarDosNumerosStateFactory } from './states/sumar-dos-numeros-state.factory';
import { SumarDosNumerosCommand } from './sumar-dos-numeros.command';
import { SumarDosNumerosHandler } from './sumar-dos-numeros.handler';
import { WhatsappModule } from '@application/whatsapp.module';

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
