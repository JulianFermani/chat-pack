import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message } from 'whatsapp-web.js';
import { SeeBusesData } from '../see-bus.session';
import { seeBusCookieFetcher } from '../infra/cookie-fetcher.service';
import { busSetter } from '../infra/bus-setter.service';
import { originPlacesFetcher } from '../infra/origin-places-fetcher.service';
import { backOrDelete } from 'src/whatsapp/shared/utils/back-or-delete-message.util';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';

export async function seeBusInit(
  message: Message,
  whatsappClient: WhatsappService,
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
    await whatsappClient.sendMessage(
      message.from,
      `😞 No se encontraron origenes`,
    );
    return;
  }

  let messageText = `🚏 Enviá el número desde dónde salis: \n${originPlacesResponse.messageText}`;
  messageText = backOrDelete(messageText);

  await whatsappClient.sendMessage(message.from, messageText);

  session.data.originPlaces = originPlacesResponse.places;
  session.step = 2;
  session.data.cookie = cookie;
  session.back = false;
  return session;
}
