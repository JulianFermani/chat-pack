import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { SeeBusesData } from '../see-bus.session';
import { Client, Message } from 'whatsapp-web.js';
import { destinationPlacesFetcher } from '../infra/destination-fetcher.service';

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

  await client.sendMessage(
    message.from,
    `🚏 Enviá el número a dónde vas: \n${destinationPlacesResponse.messageText}`,
  );

  session.data.destinationPlaces = destinationPlacesResponse.places;
  session.data.idOrigin = valueOriginPlace.toString();
  session.step = 3;
  return session;
}
