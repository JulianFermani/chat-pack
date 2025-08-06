import { Message, Client, MessageMedia } from 'whatsapp-web.js';
import { Command } from 'src/whatsapp/shared/interfaces/command.interface';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { getSeeBusCookie } from './services/cookie-fetcher.service';
import { getResponseBus } from './services/response-bus.service';
import { sleep } from './utils/sleep.util';
import { SeeBusesData } from './interfaces/see-bus-data.interface';
import { busSetter } from './services/bus-setter.service';
import { getStaticMapBuffer } from './services/map-generator.service';
import { placesFetcher } from './services/places-fetcher.service';

export class SeeBusCommand implements Command {
  name = 'verColectivos';
  description =
    'Muestra los horarios disponibles del servicio de colectivos Villa del Rosario (todas sus líneas) y, si se detecta ubicación GPS, permite visualizarla.';
  usesSession = true;

  async execute(
    message: Message,
    client: Client,
    session: UserSession<SeeBusesData>,
  ): Promise<UserSession | void> {
    let url: string;
    let data: { id: string; c?: string; a?: string };
    let cookie: string;
    switch (session.step) {
      case 1: {
        url = 'https://micronauta.dnsalias.net/usuario/select_empresa.php';
        data = { id: '5', c: '2,2,2,2,2', a: '1,2,3,4,5' };

        cookie = await getSeeBusCookie();
        await busSetter(cookie, url, data);

        url = 'https://micronauta.dnsalias.net/usuario/select_linea.php';
        data = { id: '5=2=-1:0' };
        await busSetter(cookie, url, data);

        url = 'https://micronauta.dnsalias.net/usuario/select_origen.php';
        data = { id: '0' };
        const originPlacesResponse = await placesFetcher(cookie, url, data);

        await client.sendMessage(
          message.from,
          `🚏 Enviá el número desde dónde salis: \n${originPlacesResponse.messageText}`,
        );
        session.data.originPlaces = originPlacesResponse.places;
        session.step = 2;
        session.data.cookie = cookie;
        return session;
      }
      case 2: {
        cookie = session.data.cookie;
        const idBusPlaces = session.data.originPlaces;
        const placeNum = Number(message.body.trim());

        const placeKeys = Object.keys(idBusPlaces);
        const keyOriginPlace = placeKeys[placeNum - 1];
        const valueOriginPlace = idBusPlaces[keyOriginPlace];
        if (!valueOriginPlace) {
          await client.sendMessage(message.from, 'Número inválido.');
          return session;
        }

        url = 'https://micronauta.dnsalias.net/usuario/select_destino.php';
        data = { id: valueOriginPlace.toString() };

        await busSetter(cookie, url, data);

        const destinationPlacesResponse = await placesFetcher(
          cookie,
          url,
          data,
        );

        await client.sendMessage(
          message.from,
          `🚏 Enviá el número a dónde vas: \n${destinationPlacesResponse.messageText}`,
        );

        session.data.destinationPlaces = destinationPlacesResponse.places;
        session.data.idOrigin = valueOriginPlace.toString();
        session.step = 3;
        return session;
      }
      case 3: {
        cookie = session.data.cookie;
        const idBusPlaces = session.data.destinationPlaces;
        const placeNum = Number(message.body.trim());

        const placeKeys = Object.keys(idBusPlaces);
        const keyDestinationPlace = placeKeys[placeNum - 1];
        const valueDestinationPlace = idBusPlaces[keyDestinationPlace];

        if (!valueDestinationPlace) {
          await client.sendMessage(message.from, 'Número inválido.');
          return session;
        }

        url = 'https://micronauta.dnsalias.net/usuario/select_origenp.php';
        data = { id: valueDestinationPlace.toString() };
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
          break;
        }
        return session;
      }
      case 4: {
        const ubicationNum = Number(message.body.trim());
        if (ubicationNum === 0) {
          break;
        } else if (ubicationNum === 1) {
          await client.sendMessage(message.from, '⏱️ Cargando ubicación...');
          const mapResponse = await getStaticMapBuffer(
            session.data.lat,
            session.data.lng,
          );
          const media = new MessageMedia(
            'image/png',
            mapResponse.buffer.toString('base64'),
          );
          await client.sendMessage(message.from, media, {
            caption: `Se encuentra en \n📍 *${mapResponse.location}*`,
          });
          break;
        }
      }
    }
    return;
  }
}
