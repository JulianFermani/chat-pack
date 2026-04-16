import { Module } from '@nestjs/common';

import { HolaCommand } from './hola.command';
import { HolaHandler } from './hola.handler';
import { WhatsappModule } from '@client/whatsapp.module';
import { CommandRegistryModule } from '@command-registry/command-registry.module';

@Module({
  imports: [WhatsappModule, CommandRegistryModule],
  providers: [HolaCommand, HolaHandler],
  exports: [HolaCommand],
})
export class HolaModule {}
