import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { SeeBusesData } from '../see-bus.session';
import { Client, Message } from 'whatsapp-web.js';
import { busSetter } from '../infra/bus-setter.service';
import { placesFetcher } from '../infra/places-fetcher.service';

export async function seeBusOrigin(
  message: Message,
  client: Client,
  session: UserSession<SeeBusesData>,
): Promise<UserSession<SeeBusesData> | void> {
  const cookie = session.data.cookie;
  const idBusPlaces = session.data.originPlaces;
  const placeNum = Number(message.body.trim());

  const placeKeys = Object.keys(idBusPlaces);
  const keyOriginPlace = placeKeys[placeNum - 1];
  const valueOriginPlace = idBusPlaces[keyOriginPlace];
  if (!valueOriginPlace) {
    await client.sendMessage(message.from, 'Número inválido.');
    return session;
  }

  const url = 'https://micronauta.dnsalias.net/usuario/select_destino.php';
  const data = { id: valueOriginPlace.toString() };

  await busSetter(cookie, url, data);

  const destinationPlacesResponse = await placesFetcher(cookie, url, data);

  if (
    destinationPlacesResponse.messageText === null ||
    destinationPlacesResponse.places === null
  ) {
    await client.sendMessage(message.from, `😞 No se encontraron destinos`);
    return;
  }

  await client.sendMessage(
    message.from,
    `🚏 Enviá el número a dónde vas: \n${destinationPlacesResponse.messageText}`,
  );

  session.data.destinationPlaces = destinationPlacesResponse.places;
  session.data.idOrigin = valueOriginPlace.toString();
  session.step = 3;
  return session;
}
