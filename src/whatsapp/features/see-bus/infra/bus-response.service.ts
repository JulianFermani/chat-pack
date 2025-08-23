import axios from 'axios';

interface ResponseBus {
  message: string;
  hasUbication: boolean;
  lat: string;
  lng: string;
}

interface BusData {
  fecha: string;
  origen: string;
  destino: string;
  hora_salida: string;
  llega: string;
  demora: string;
  se_anuncia: string;
  coche: string;
  lat: string;
  lon: string;
  empresa: string;
  empresa_id: string;
  [key: string]: any;
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

  const url =
    'https://micronauta2.dnsalias.net/usuario/app/yaviene/buscador_cmd.php';

  const postData = new URLSearchParams();
  postData.append('cmd', 'buscar_horarios');
  postData.append('fecha_salida', data.todayDate);
  postData.append('origen', data.idOrigin);
  postData.append('destino', data.idDestination);

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: '*/*',
    Cookie: `PHPSESSID=${cookie}`,
    'User-Agent':
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
  };

  const res = await axios.post<{ [key: string]: BusData[] }>(
    url,
    postData.toString(),
    { headers },
  );

  const dataResponse = res.data;

  let message = '';

  Object.values(dataResponse).forEach((busArray) => {
    busArray.forEach((bus) => {
      if (!message) {
        message += `🟢 *Origen:* ${bus.origen}\n🔴 *Destino:* ${bus.destino}\n\n`;
      }

      message += `🕕 *Sale:* ${bus.hora_salida}\n`;
      message += `🕧 *Llega:* ${bus.llega}\n`;

      if (bus.demora) {
        message += `⏱️ *Demora:* ${bus.demora}\n`;
      }

      if (bus.empresa) {
        message += `🏢 *Empresa:* ${bus.empresa.substring(0, bus.empresa.length - 2)}\n`;
      }

      if (bus.se_anuncia) {
        message += `📢 *Se anuncia:* ${bus.se_anuncia}\n`;
      }

      if (bus.coche) {
        message += `🚍 *Coche:* ${bus.coche}`;
      }

      message += `\n━━━━━━━━━━━━━━\n\n`;

      if (bus.lat && bus.lon) {
        responseBus.hasUbication = true;
        responseBus.lat = bus.lat;
        responseBus.lng = bus.lon;
      }
    });
  });

  if (responseBus.hasUbication) {
    message += `🗺️ *Se encontró ubicación en el mapa:*\n ¿Desea verlo?\n1️⃣ Si\n0️⃣ No  `;
  } else {
    message += `📍 *No se encontró ubicación en el mapa.*`;
  }

  responseBus.message = message;

  return responseBus;
}
