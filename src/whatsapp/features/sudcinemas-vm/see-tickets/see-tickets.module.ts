import { forwardRef, Module } from '@nestjs/common';
import { WhatsappModule } from 'src/whatsapp/application/whatsapp.module';
import { SeeTicketsCommand } from './see-tickets.command';
import { SeeTicketsHandler } from './see-tickets.handler';
import { GetUserMovieState } from './states/get-user-movie.state';
import { GetUserShowtimeState } from './states/get-user-showtime.state';
import { SendUserShowtimesState } from './states/send-user-showtime.state';
import { SeeTicketsStateFactory } from './states/see-tickets-state.factory';

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
