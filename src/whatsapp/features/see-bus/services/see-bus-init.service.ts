import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Client, Message } from 'whatsapp-web.js';
import { SeeBusesData } from '../see-bus.session';
import { seeBusCookieFetcher } from '../infra/cookie-fetcher.service';
import { busSetter } from '../infra/bus-setter.service';
import { placesFetcher } from '../infra/places-fetcher.service';

export async function seeBusInit(
  message: Message,
  client: Client,
  session: UserSession<SeeBusesData>,
): Promise<UserSession<SeeBusesData> | void> {
  type Data = {
    id: string;
    c?: string;
    a?: string;
  };

  let url = 'https://micronauta.dnsalias.net/usuario/select_empresa.php';
  let data: Data = { id: '5', c: '2,2,2,2,2', a: '1,2,3,4,5' };

  const cookie = await seeBusCookieFetcher();
  await busSetter(cookie, url, data);

  url = 'https://micronauta.dnsalias.net/usuario/select_linea.php';
  data = { id: '5=2=-1:0' };
  await busSetter(cookie, url, data);

  url = 'https://micronauta.dnsalias.net/usuario/select_origen.php';
  data = { id: '0' };

  const originPlacesResponse = await placesFetcher(cookie, url, data);

  if (
    originPlacesResponse.messageText === null ||
    originPlacesResponse.places === null
  ) {
    await client.sendMessage(message.from, `😞 No se encontraron origenes`);
    return;
  }

  await client.sendMessage(
    message.from,
    `🚏 Enviá el número desde dónde salis: \n${originPlacesResponse.messageText}`,
  );

  session.data.originPlaces = originPlacesResponse.places;
  session.step = 2;
  session.data.cookie = cookie;
  return session;
}
