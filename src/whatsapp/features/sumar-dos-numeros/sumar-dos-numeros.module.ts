import { Module } from '@nestjs/common';

import { AddTwoNumbersState } from './states/add-two-numbers.state';
import { FirstNumberState } from './states/first-number.state';
import { SecondNumberState } from './states/second-number.state';
import { SumarDosNumerosStateFactory } from './states/sumar-dos-numeros-state.factory';
import { SumarDosNumerosCommand } from './sumar-dos-numeros.command';
import { SumarDosNumerosHandler } from './sumar-dos-numeros.handler';
import { WhatsappModule } from '@client/whatsapp.module';
import { CommandRegistryModule } from '@command-registry/command-registry.module';

@Module({
  imports: [WhatsappModule, CommandRegistryModule],
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
