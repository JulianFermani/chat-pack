import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { SeeBusesData } from '../see-bus.session';
import { Client, Message } from 'whatsapp-web.js';
import { destinationPlacesFetcher } from '../infra/destination-fetcher.service';
import { backOrDelete } from 'src/whatsapp/shared/utils/back-or-delete-message.util';

export async function seeBusOrigin(
  message: Message,
  client: Client,
  session: UserSession<SeeBusesData>,
): Promise<UserSession<SeeBusesData> | void> {
  const cookie = session.data.cookie;
  const idBusPlaces = session.data.originPlaces;
  let placeNum: number;
  if (session.data.numUserOrigin && session.back === true) {
    placeNum = Number(session.data.numUserOrigin);
  } else {
    placeNum = Number(message.body.trim());
  }

  const placeKeys = Object.keys(idBusPlaces);
  const keyOriginPlace = placeKeys[placeNum - 1];
  const valueOriginPlace = idBusPlaces[keyOriginPlace];
  if (!valueOriginPlace) {
    await client.sendMessage(message.from, 'Número inválido.');
    return session;
  }

  const url =
    'https://micronauta2.dnsalias.net/usuario/app/yaviene/buscador_cmd.php';
  const data = {
    cmd: 'buscar_destino_empresa',
    idLocalidadGobierno: valueOriginPlace.toString(),
  };

  const destinationPlacesResponse = await destinationPlacesFetcher(
    cookie,
    url,
    data,
  );

  if (
    destinationPlacesResponse.messageText === null ||
    destinationPlacesResponse.places === null
  ) {
    await client.sendMessage(message.from, `😞 No se encontraron destinos`);
    return;
  }

  let messageText = `🚏 Enviá el número a dónde vas: \n${destinationPlacesResponse.messageText}`;
  messageText = backOrDelete(messageText);

  await client.sendMessage(message.from, messageText);

  session.data.destinationPlaces = destinationPlacesResponse.places;
  session.data.idOrigin = valueOriginPlace.toString();
  session.data.numUserOrigin = placeNum;
  session.step = 3;
  session.back = false;
  return session;
}
