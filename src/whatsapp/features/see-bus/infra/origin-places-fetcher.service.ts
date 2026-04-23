import axios from 'axios';

import { getEmojiNumber } from '@shared/utils/number-format.util';

interface Place {
  id: string;
  nombre: string;
  desc_publica: string;
}

interface PlacesResponse {
  places: { [key: string]: string };
  messageText: string;
}

const isPlace = (value: unknown): value is Place => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const place = value as Record<string, unknown>;

  return (
    typeof place.id === 'string' &&
    typeof place.nombre === 'string' &&
    typeof place.desc_publica === 'string'
  );
};

export async function originPlacesFetcher(
  cookie: string,
  url: string,
): Promise<PlacesResponse> {
  const placesResponse: PlacesResponse = {
    places: {},
    messageText: '',
  };

  // Hacemos la request solo con los headers mínimos
  const res = await axios.get<string>(url, {
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

  const parsedPlaces: unknown = JSON.parse(match[1]);

  if (!Array.isArray(parsedPlaces)) {
    throw new Error('El formato de localidades es inválido');
  }

  const places: Place[] = parsedPlaces.filter(isPlace);

  places.forEach(({ id, nombre }) => {
    placesResponse.places[nombre] = id;
  });

  placesResponse.messageText = Object.keys(placesResponse.places)
    .map((place, index) => `${getEmojiNumber(index + 1)}. ${place}`)
    .join('\n');

  return placesResponse;
}
