import { UserSessionBase } from './user-session.base';
import { Movie } from '../interfaces/movie.interface';
import { Showtime } from '../interfaces/showtime.interface';
/* eslint-disable @typescript-eslint/no-empty-object-type */
export type SeeTicketsSession =
  | (UserSessionBase & { step: 1; data: { movies: Movie[] } })
  | (UserSessionBase & { step: 2; data: { movies: Movie[] } })
  | (UserSessionBase & {
      step: 3;
      data: { movie: Movie; showtimes: Showtime[]; dates: [Date, Date, Date] };
    });

export type SumarDosNumerosSession =
  | (UserSessionBase & { step: 1; data: {} })
  | (UserSessionBase & { step: 2; data: { a: number } })
  | (UserSessionBase & { step: 3; data: { a: number; b: number } });
