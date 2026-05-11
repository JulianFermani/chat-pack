import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { WhatsappService } from '@client/whatsapp.service';
import { UserSession } from '@session/user-session.interface';
import { State } from '@shared/interfaces/state.interface';
import { backOrDelete } from '@shared/utils/back-or-delete-message.util';
import { destinationPlacesFetcher } from '../../infra/destination-fetcher.service';
import { SegmentAlertEnumCommands } from '../enum/commands.enum';
import { SegmentAlertSessionData } from '../segment-alert.session';

@Injectable()
export class SegmentAlertOriginState implements State<SegmentAlertSessionData> {
  readonly stepId = SegmentAlertEnumCommands.ORIGIN;

  constructor(
    private readonly whatsapp: WhatsappService,
    private readonly config: ConfigService,
  ) {}

  async handle(
    message: Message,
    session: UserSession<SegmentAlertSessionData>,
  ) {
    const cookie = session.data.cookie;
    const originPlaces = session.data.originPlaces;

    const placeNum =
      session.data.numUserOrigin && session.back
        ? Number(session.data.numUserOrigin)
        : Number(message.body.trim());

    const placeKeys = Object.keys(originPlaces);
    const selectedPlaceKey = placeKeys[placeNum - 1];
    const selectedOrigin = originPlaces[selectedPlaceKey];

    if (!selectedOrigin) {
      await this.whatsapp.sendMessage(message.from, 'Numero invalido.');
      return session;
    }

    const apiUrl = this.config.get<string>('SEE_BUS_BASE_URL');
    const url = `${apiUrl}buscador_cmd.php`;

    const destinationPlacesResponse = await destinationPlacesFetcher(
      cookie,
      url,
      {
        cmd: 'buscar_destino_empresa',
        idLocalidadGobierno: selectedOrigin.toString(),
      },
    );

    let messageText = `🚏 Envia el numero del destino del tramo:\n${destinationPlacesResponse.messageText}`;
    messageText = backOrDelete(messageText);

    await this.whatsapp.sendMessage(message.from, messageText);

    session.data.destinationPlaces = destinationPlacesResponse.places;
    session.data.idOrigin = selectedOrigin.toString();
    session.data.numUserOrigin = placeNum;
    session.steps.push(SegmentAlertEnumCommands.DESTINATION);
    session.back = false;

    return session;
  }
}
