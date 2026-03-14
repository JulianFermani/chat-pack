import { Module } from '@nestjs/common';

import { WhatsappModule } from '@client/whatsapp.module';
import { SeeMoviesCommand } from './see-movies.command';
import { SeeMoviesHandler } from './see-movies.handler';
import { CommandRegistryModule } from '@command-registry/command-registry.module';

@Module({
  imports: [WhatsappModule, CommandRegistryModule],
  providers: [SeeMoviesCommand, SeeMoviesHandler],
  exports: [SeeMoviesCommand],
})
export class SeeMoviesModule {}
