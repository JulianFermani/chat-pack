import { Message } from 'whatsapp-web.js';
import { UserMovie } from '../../see-movies/model/see-movie-movie.interface';
import { MovieResponse } from '../../see-movies/model/see-movie.dto';

export async function movieFetcher(
  message: Message,
): Promise<UserMovie[] | null> {
  try {
    const url = `https://apiv2.gaf.adro.studio/nowPlaying/29/`;
    const res = await fetch(url);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: MovieResponse = await res.json();
    if (!res.ok || data.status !== 'ok') {
      await message.reply('Error al obtener las películas.');
      return null;
    }

    return data.data;
  } catch (error) {
    console.error('Error en LookForMovies:', error);
    await message.reply('Ocurrió un error al buscar las películas.');
    return null;
  }
}
