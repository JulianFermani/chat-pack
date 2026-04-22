import { UserMovie } from '@features/sudcinemas-vm/see-movies/model/see-movie-movie.interface';
import { getEmojiNumber } from '@shared/utils/number-format.util';

export function movieBuilderMessage(movies: UserMovie[]): string {
  return movies
    .map(
      (movie, index) =>
        `${getEmojiNumber(index + 1)}. ${movie.nombre}\n🎞️ Formato: ${movie.formato}\n🗣️ Lenguaje: ${movie.lenguaje}`,
    )
    .join('\n\n');
}
