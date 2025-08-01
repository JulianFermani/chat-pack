import axios from 'axios';
import * as cheerio from 'cheerio';
import { getEmojiNumber } from '../utils/number-format.util';
interface PlacesResponse {
  places: { [key: string]: string };
  messageText: string;
}

export async function placesFetcher(
  cookie: string,
  url: string,
  data: { id: string },
): Promise<PlacesResponse> {
  const placesResponse: PlacesResponse = {
    places: {},
    messageText: '',
  };
  const dataToUrl = new URLSearchParams(data).toString();

  const res = await axios.post(url, dataToUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Cookie: `PHPSESSID=${cookie}`,
    },
  });

  const html = res.data;
  const $ = cheerio.load(html);

  $('option[value]').each((index, element) => {
    const value = $(element).attr('value') || '';
    const name = $(element).text().trim();
    placesResponse.places[name] = value;
  });

  const messageText = Object.keys(placesResponse.places)
    .map((place, index) => `${getEmojiNumber(index + 1)}. ${place}`)
    .join('\n');

  placesResponse.messageText = messageText;

  return placesResponse;
}
