import { UserMovie } from './movie.interface';
import { UserShowtime } from './showtime.interface';

export interface SeeTicketsData {
  movies: UserMovie[] | null;
  movie: UserMovie;
  showtimes: UserShowtime[] | null;
  dates: [Date, Date, Date];
}
