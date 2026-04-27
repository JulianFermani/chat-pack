import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { WhatsappService } from '@client/whatsapp.service';
import { UserSession } from '@session/user-session.interface';
import { State } from '@shared/interfaces/state.interface';
import { backOrDelete } from '@shared/utils/back-or-delete-message.util';
import { SegmentAlertEnumCommands } from '../enum/commands.enum';
import { SegmentAlertSessionData } from '../segment-alert.session';

@Injectable()
export class SegmentAlertDestinationState
  implements State<SegmentAlertSessionData>
{
  readonly stepId = SegmentAlertEnumCommands.DESTINATION;

  constructor(private readonly whatsapp: WhatsappService) {}

  async handle(
    message: Message,
    session: UserSession<SegmentAlertSessionData>,
  ) {
    const destinationPlaces = session.data.destinationPlaces;
    const placeNum =
      session.data.numUserDestination && session.back
        ? Number(session.data.numUserDestination)
        : Number(message.body.trim());

    const placeKeys = Object.keys(destinationPlaces);
    const selectedPlaceKey = placeKeys[placeNum - 1];
    const selectedDestination = destinationPlaces[selectedPlaceKey];

    if (!selectedDestination) {
      await this.whatsapp.sendMessage(message.from, 'Numero invalido.');
      return session;
    }

    let messageText =
      '✍️ Envia la linea y el sentido para la alerta.\nEjemplo: *35 I* o *35 V*\n\nI = ida\nV = vuelta';
    messageText = backOrDelete(messageText);

    await this.whatsapp.sendMessage(message.from, messageText);

    session.data.idDestination = selectedDestination.toString();
    session.data.numUserDestination = placeNum;
    session.steps.push(SegmentAlertEnumCommands.LINE_AND_SENSE);
    session.back = false;

    return session;
  }
}
