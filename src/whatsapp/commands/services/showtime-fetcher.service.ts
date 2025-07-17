import { Message } from 'whatsapp-web.js';
import { Showtime } from '../interfaces/showtime.interface';
import { ResponseShowtimes } from '../dto/showtime-response.dto';

export async function fetchShowtimes(
  pref: string,
  message: Message,
): Promise<Showtime[] | null> {
  try {
    const url = `https://apiv2.gaf.adro.studio/movie/29/${pref}`;
    const res = await fetch(url);
    const data: ResponseShowtimes = await res.json();

    if (!res.ok || data.status !== 'ok') {
      await message.reply('Error al obtener funciones');
      return null;
    }

    return data.data.showtimes;
  } catch (err) {
    console.error(err);
    await message.reply('Error interno al consultar funciones');
    return null;
  }
}
