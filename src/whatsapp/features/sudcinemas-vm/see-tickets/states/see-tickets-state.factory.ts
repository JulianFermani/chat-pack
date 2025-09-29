import { State } from 'src/whatsapp/shared/interfaces/state.interface';
import { GetUserMovieState } from './get-user-movie.state';
import { GetUserShowtimeState } from './get-user-showtime.state';
import { SendUserShowtimesState } from './send-user-showtime.state';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SeeTicketsStateFactory {
  private states: Map<number, State> = new Map();

  constructor(
    private getUserMovie: GetUserMovieState,
    private getUserShowtime: GetUserShowtimeState,
    private sendUserShowtime: SendUserShowtimesState,
  ) {
    this.states.set(this.getUserMovie.stepId, this.getUserMovie);
    this.states.set(this.getUserShowtime.stepId, this.getUserShowtime);
    this.states.set(this.sendUserShowtime.stepId, this.sendUserShowtime);
  }

  get(step: number): State | undefined {
    return this.states.get(step);
  }
}
