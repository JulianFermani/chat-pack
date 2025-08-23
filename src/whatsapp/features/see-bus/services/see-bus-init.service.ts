import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Client, Message } from 'whatsapp-web.js';
import { SeeBusesData } from '../see-bus.session';
import { seeBusCookieFetcher } from '../infra/cookie-fetcher.service';
import { busSetter } from '../infra/bus-setter.service';
import { originPlacesFetcher } from '../infra/origin-places-fetcher.service';

export async function seeBusInit(
  message: Message,
  client: Client,
  session: UserSession<SeeBusesData>,
): Promise<UserSession<SeeBusesData> | void> {
  type Data = {
    cmd: string;
    conf: string;
    tkn: string;
  };

  const cookie = await seeBusCookieFetcher();

  let url =
    'https://micronauta2.dnsalias.net/usuario/app/yaviene/?conf=elporvenir';
  const originPlacesResponse = await originPlacesFetcher(cookie, url);

  url = 'https://micronauta2.dnsalias.net/usuario/app/yaviene/buscador_cmd.php';
  const data: Data = { cmd: 'isLogin', conf: 'elporvenir', tkn: 'null' };

  await busSetter(cookie, url, data);

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
