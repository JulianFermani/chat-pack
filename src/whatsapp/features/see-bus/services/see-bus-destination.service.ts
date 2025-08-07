import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Client, Message } from 'whatsapp-web.js';
import { SeeBusesData } from '../see-bus.session';
import { busSetter } from '../infra/bus-setter.service';
import { sleep } from 'src/whatsapp/shared/utils/sleep.util';
import { getResponseBus } from '../infra/bus-response.service';

export async function seeBusDestination(
  message: Message,
  client: Client,
  session: UserSession<SeeBusesData>,
): Promise<UserSession<SeeBusesData> | void> {
  const cookie = session.data.cookie;
  const idBusPlaces = session.data.destinationPlaces;
  const placeNum = Number(message.body.trim());

  const placeKeys = Object.keys(idBusPlaces);
  const keyDestinationPlace = placeKeys[placeNum - 1];
  const valueDestinationPlace = idBusPlaces[keyDestinationPlace];

  if (!valueDestinationPlace) {
    await client.sendMessage(message.from, 'Número inválido.');
    return session;
  }

  const url = 'https://micronauta.dnsalias.net/usuario/select_origenp.php';
  const data = { id: valueDestinationPlace.toString() };
  await busSetter(cookie, url, data);

  const date = new Date();
  const dateFormat = date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const dataResponseBus = {
    idOrigin: session.data.idOrigin,
    idDestination: valueDestinationPlace.toString(),
    todayDate: dateFormat,
  };

  await sleep(5000);
  const responseBus = await getResponseBus(cookie, dataResponseBus);
  await client.sendMessage(message.from, responseBus.message);
  session.data.idDestination = valueDestinationPlace.toString();
  if (responseBus.hasUbication) {
    session.step = 4;
    session.data.lat = responseBus.lat;
    session.data.lng = responseBus.lng;
  } else {
    // Esto deberia bastar para borrar la sesión, creo?
    return;
  }
  return session;
}
