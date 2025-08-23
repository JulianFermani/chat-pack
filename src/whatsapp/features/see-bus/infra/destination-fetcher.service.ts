import axios from 'axios';
import { getEmojiNumber } from 'src/whatsapp/shared/utils/number-format.util';

interface PlacesResponse {
  places: { [key: string]: string };
  messageText: string;
}

interface ApiPlace {
  id_empresa: string;
  nombre: string;
  cliente: string;
}

export async function destinationPlacesFetcher(
  cookie: string,
  url: string,
  data: { cmd: string; idLocalidadGobierno: string },
) {
  const placesResponse: PlacesResponse = {
    places: {},
    messageText: '',
  };

  const postData = new URLSearchParams();
  postData.append('cmd', data.cmd);
  postData.append('idLocalidadGobierno', data.idLocalidadGobierno);

  const res = await axios.post<{ [key: string]: ApiPlace }>(
    url,
    postData.toString(),
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: `PHPSESSID=${cookie}`,
      },
    },
  );

  const dataJson = res.data;

  Object.values(dataJson).forEach(({ id_empresa, nombre }) => {
    placesResponse.places[nombre] = id_empresa;
  });

  placesResponse.messageText = Object.keys(placesResponse.places)
    .map((place, index) => `${getEmojiNumber(index + 1)}. ${place}`)
    .join('\n');

  return placesResponse;
}
