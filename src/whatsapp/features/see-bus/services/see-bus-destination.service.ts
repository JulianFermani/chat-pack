import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message } from 'whatsapp-web.js';
import { SeeBusesData } from '../see-bus.session';
import { sleep } from 'src/whatsapp/shared/utils/sleep.util';
import { getResponseBus } from '../infra/bus-response.service';
import { backOrDelete } from '../../../shared/utils/back-or-delete-message.util';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';

export async function seeBusDestination(
  message: Message,
  whatsappClient: WhatsappService,
  session: UserSession<SeeBusesData>,
): Promise<UserSession<SeeBusesData>> {
  const cookie = session.data.cookie;
  const idBusPlaces = session.data.destinationPlaces;
  let placeNum: number;

  if (session.data.numUserDestination && session.back === true) {
    placeNum = Number(session.data.numUserDestination);
  } else {
    placeNum = Number(message.body.trim());
  }

  const placeKeys = Object.keys(idBusPlaces);
  const keyDestinationPlace = placeKeys[placeNum - 1];
  const valueDestinationPlace = idBusPlaces[keyDestinationPlace];

  if (!valueDestinationPlace) {
    await whatsappClient.sendMessage(message.from, 'Número inválido.');
    return session;
  }

  const date = new Date();

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const dateFormat = `${year}-${month}-${day}`;

  const dataResponseBus = {
    cmd: 'buscar_horarios',
    idOrigin: session.data.idOrigin,
    idDestination: valueDestinationPlace.toString(),
    todayDate: dateFormat,
  };

  await sleep(5000);
  const responseBus = await getResponseBus(cookie, dataResponseBus);
  const messageText = backOrDelete(responseBus.message);
  await whatsappClient.sendMessage(message.from, messageText);
  session.data.idDestination = valueDestinationPlace.toString();
  session.data.numUserDestination = placeNum;
  if (responseBus.hasUbication) {
    session.data.lat = responseBus.lat;
    session.data.lng = responseBus.lng;
  }
  session.step = 4;
  session.back = false;
  return session;
}
