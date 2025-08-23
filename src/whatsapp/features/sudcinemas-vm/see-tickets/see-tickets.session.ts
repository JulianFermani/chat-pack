import { UserMovie } from '../see-movies/model/see-movie-movie.interface';
import { UserShowtime } from './model/see-tickets-showtimes.interface';

export interface SeeTicketsData {
  movies: UserMovie[];
  movie: UserMovie;
  showtimes: UserShowtime[];
  dates: [Date, Date, Date];
}
