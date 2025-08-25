import axios from 'axios';
import { getEmojiNumber } from 'src/whatsapp/shared/utils/number-format.util';

interface Place {
  id: string;
  nombre: string;
  desc_publica: string;
}

interface PlacesResponse {
  places: { [key: string]: string };
  messageText: string;
}

export async function originPlacesFetcher(
  cookie: string,
  url: string,
): Promise<PlacesResponse> {
  const placesResponse: PlacesResponse = {
    places: {},
    messageText: '',
  };

  // Hacemos la request solo con los headers mínimos
  const res = await axios.get(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Cookie: `PHPSESSID=${cookie}`,
    },
  });

  const html = res.data;

  const match = html.match(/const localidades_cordoba = (\[.*?\]);/s);
  if (!match) {
    throw new Error('No se pudieron encontrar las localidades en la respuesta');
  }

  const places: Place[] = JSON.parse(match[1]);

  places.forEach(({ id, nombre }) => {
    placesResponse.places[nombre] = id;
  });

  placesResponse.messageText = Object.keys(placesResponse.places)
    .map((place, index) => `${getEmojiNumber(index + 1)}. ${place}`)
    .join('\n');

  return placesResponse;
}
