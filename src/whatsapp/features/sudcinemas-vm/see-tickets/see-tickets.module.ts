import { Module } from '@nestjs/common';

import { SeeTicketsCommand } from './see-tickets.command';
import { SeeTicketsHandler } from './see-tickets.handler';
import { GetUserMovieState } from './states/get-user-movie.state';
import { GetUserShowtimeState } from './states/get-user-showtime.state';
import { SeeTicketsStateFactory } from './states/see-tickets-state.factory';
import { SendUserShowtimesState } from './states/send-user-showtime.state';
import { WhatsappModule } from '@client/whatsapp.module';
import { CommandRegistryModule } from '@command-registry/command-registry.module';

@Module({
  imports: [WhatsappModule, CommandRegistryModule],
  providers: [
    SeeTicketsCommand,
    SeeTicketsHandler,
    SeeTicketsStateFactory,
    GetUserMovieState,
    GetUserShowtimeState,
    SendUserShowtimesState,
  ],
  exports: [SeeTicketsCommand],
})
export class SeeTicketsModule {}
