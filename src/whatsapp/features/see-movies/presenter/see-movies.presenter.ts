import { UserMovie } from 'src/whatsapp/domain/commands/interfaces/movie.interface';
import { getEmojiNumber } from 'src/whatsapp/shared/utils/number-format.util';

export function movieBuilderMessage(movies: UserMovie[]): string {
  return movies
    .map(
      (movie, index) =>
        `${getEmojiNumber(index + 1)}. ${movie.nombre}\n🎞️ Formato: ${movie.formato}\n🗣️ Lenguaje: ${movie.lenguaje}`,
    )
    .join('\n\n');
}
