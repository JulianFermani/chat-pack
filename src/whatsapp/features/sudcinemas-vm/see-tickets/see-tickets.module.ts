import { forwardRef, Module } from '@nestjs/common';

import { SeeTicketsCommand } from './see-tickets.command';
import { SeeTicketsHandler } from './see-tickets.handler';
import { GetUserMovieState } from './states/get-user-movie.state';
import { GetUserShowtimeState } from './states/get-user-showtime.state';
import { SeeTicketsStateFactory } from './states/see-tickets-state.factory';
import { SendUserShowtimesState } from './states/send-user-showtime.state';
import { WhatsappModule } from '@application/whatsapp.module';

@Module({
  imports: [forwardRef(() => WhatsappModule)],
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
