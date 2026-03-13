import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { destinationPlacesFetcher } from '../infra/destination-fetcher.service';
import { SeeBusesData } from '../see-bus.session';
import { WhatsappService } from '@application/whatsapp.service';
import { UserSession } from '@session/user-session.interface';
import { State } from '@shared/interfaces/state.interface';
import { backOrDelete } from '@shared/utils/back-or-delete-message.util';

@Injectable()
export class SeeBusOriginState implements State<SeeBusesData> {
  readonly stepId = 2;
  constructor(
    private readonly whatsapp: WhatsappService,
    private readonly config: ConfigService,
  ) {}
  async handle(message: Message, session: UserSession<SeeBusesData>) {
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
      await this.whatsapp.sendMessage(message.from, 'Número inválido.');
      return session;
    }

    const apiUrl = this.config.get<string>('SEE_BUS_BASE_URL');
    const url = `${apiUrl}buscador_cmd.php`;

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
      await this.whatsapp.sendMessage(
        message.from,
        `😞 No se encontraron destinos`,
      );
      return;
    }

    let messageText = `🚏 Enviá el número a dónde vas: \n${destinationPlacesResponse.messageText}`;
    messageText = backOrDelete(messageText);

    await this.whatsapp.sendMessage(message.from, messageText);

    session.data.destinationPlaces = destinationPlacesResponse.places;
    session.data.idOrigin = valueOriginPlace.toString();
    session.data.numUserOrigin = placeNum;
    session.step = 3;
    session.back = false;
    return session;
  }
}
