import axios from 'axios';
import * as cheerio from 'cheerio';
interface ResponseBus {
  message: string;
  hasUbication: boolean;
  lat: string;
  lng: string;
}

export async function getResponseBus(
  cookie: string,
  data: { idOrigin: string; idDestination: string; todayDate: string },
): Promise<ResponseBus> {
  const responseBus: ResponseBus = {
    message: '',
    hasUbication: false,
    lat: '',
    lng: '',
  };
  const url = 'https://micronauta.dnsalias.net/usuario/respuesta.php';
  const dataToUrl = new URLSearchParams({
    uc: 'diego',
    reloadValue: '1753124198933',
    sel_prov: '5',
    c: '2,2,2,2,2',
    a: '1,2,3,4,5',
    sel_empresa: '5=2=-1:0',
    reserva: '1',
    cant_pasj: '1',
    fecha: data.todayDate,
    fecha_vuelta: data.todayDate,
    sel_linea: '0',
    sel_origen: data.idOrigin,
    sel_destino: data.idDestination,
    sel_origenp: '',
    sel_destinop: '',
    sel_rampa: 'off',
    buscar: 'Buscar',
    html5: '1',
  }).toString();

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    Cookie: `PHPSESSID=${cookie}`,
    'User-Agent':
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    Referer: 'https://micronauta.dnsalias.net/usuario/index.php?a=diego',
  };

  const response = await axios.post(url, dataToUrl, {
    headers,
  });

  const html = response.data;
  const $ = cheerio.load(html);

  const origin = $('.tramo').first().text().trim();
  const destination = $('.tramo').last().text().trim();

  const departureTimes = $('.hsalida')
    .map((i, el) => $(el).text().trim().slice(0, 5))
    .get();

  const arrivalTimes = $('.hllegada')
    .map((i, el) => $(el).text().trim().slice(0, 5))
    .get();

  const infoAnnouncement = $('.info.span-b')
    .map((i, el) => {
      const $el = $(el);
      $el.find('br').replaceWith('\n');
      let text = $el.text().trim();
      text = text.replace(/-/g, ' '); // elimina los '-'
      return text;
    })
    .get();

  const objectTag = $('object[data*="maps.google.com"]').first();
  const mapUrl = objectTag.attr('data') ?? null;
  if (mapUrl) {
    const coordsMatch = mapUrl.match(/q=([-.\d]+),([-.\d]+)/);
    if (coordsMatch) {
      responseBus.hasUbication = true;
      responseBus.lat = coordsMatch?.[1];
      responseBus.lng = coordsMatch?.[2];
    }
  }

  let message = `🚌 *Origen:* ${origin}\n📍 *Destino:* ${destination}\n\n`;

  for (let i = 0; i < departureTimes.length; i++) {
    message += `🕕 *Sale:* ${departureTimes[i]}\n`;
    message += `🕧 *Llega:* ${arrivalTimes[i]}\n`;

    if (infoAnnouncement[i]) {
      const extraInfo = infoAnnouncement[i]
        .split('\n')
        .map((line) => `🔸 ${line.trim()}`)
        .join('\n');
      message += `${extraInfo}\n`;
    }

    message += `\n━━━━━━━━━━━━━━\n\n`;
  }

  console.log(`${mapUrl}`);

  if (mapUrl) {
    message += `🗺️ *Se encontró ubicación en el mapa:*\n ¿Desea verlo?\n1️⃣ Si\n0️⃣ No  `;
  } else {
    message += `📍 *No se encontró ubicación en el mapa.*`;
  }

  responseBus.message = message;

  return responseBus;
}
