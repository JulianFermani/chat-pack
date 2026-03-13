import { forwardRef, Module } from '@nestjs/common';

import { WhatsappModule } from '@application/whatsapp.module';
import { SeeMoviesCommand } from './see-movies.command';
import { SeeMoviesHandler } from './see-movies.handler';

@Module({
  imports: [forwardRef(() => WhatsappModule)],
  providers: [SeeMoviesCommand, SeeMoviesHandler],
  exports: [SeeMoviesCommand],
})
export class SeeMoviesModule {}
