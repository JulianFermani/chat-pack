import { Module } from '@nestjs/common';

import { WhatsappModule } from '@client/whatsapp.module';
import { CommandRegistryModule } from '@command-registry/command-registry.module';
import { SeeTodaysGamesCommand } from './see-todays-games.command';
import { SeeTodaysGamesHandler } from './see-todays-games.handler';

@Module({
  imports: [WhatsappModule, CommandRegistryModule],
  providers: [SeeTodaysGamesCommand, SeeTodaysGamesHandler],
  exports: [SeeTodaysGamesCommand],
})
export class SeeTodaysGamesModule {}
