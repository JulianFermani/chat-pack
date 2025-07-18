import { Message, Client } from 'whatsapp-web.js';
import { Command } from './interfaces/command.interface';
import { UserSession } from '../../sessions/user-session.interface';
import { Movie } from './interfaces/movie.interface';

// Tipo para el póster de la película
type Poster = {
  id: number;
  path: string;
};

// Tipo para cada película
type Pelicula = {
  codigoPelicula: string;
  pref: string;
  nombre: string;
  Condicion: string;
  formato: string;
  lenguaje: string;
  release: number; // 0 o 1 según estado de lanzamiento
  preSale: number; // 0 o 1 según preventa
  poster: Poster;
};

// Tipo para la respuesta completa
type ResponsePeliculas = {
  status: string;
  data: Pelicula[];
};

export class LookForMovies implements Command {
  name = 'verPeliculas';
  description =
    'Devuelve todas las peliculas en cartelera que hay en el cine de sudcinemas villa maria';
  usesSession: false;

  async execute(message: Message, client: Client): Promise<UserSession | void> {
    const url = 'https://apiv2.gaf.adro.studio/nowPlaying/29';
    // TODO: reescribir data para no tener: Unsafe assignment of an `any` value.
    try {
      const response = await fetch(url);
      console.log(response);
      if (!response.ok) {
        await message.reply('Error al obtener las películas.');
        return null;
      }

      const data: ResponsePeliculas = await response.json();

      if (data.status !== 'ok' || !Array.isArray(data.data)) {
        await message.reply('No se encontraron películas disponibles.');
        return null;
      }

      // Extraemos y formateamos las películas
      const movies = data.data as Movie[];

      if (movies.length === 0) {
        await message.reply('No hay películas en cartelera en este momento.');
        return null;
      }

      const messageText = movies
        .map(
          (movie, index) =>
            `${index + 1}. *${movie.nombre}*\nFormato: ${movie.formato}\nLenguaje: ${movie.lenguaje}`,
        )
        .join('\n\n');

      // Enviamos el mensaje con la lista de películas
      await client.sendMessage(
        message.from,
        `*Películas en cartelera* \n${messageText}`,
      );
    } catch (error) {
      console.error('Error en LookForMovies:', error);
      await message.reply('Ocurrió un error al buscar las películas.');
    }

    return null;
  }
}
