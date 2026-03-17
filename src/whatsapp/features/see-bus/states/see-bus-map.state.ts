import { Message, MessageMedia } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { seeBusMapGenerator } from '../infra/map-generator.service';
import { SeeBusesData } from '../see-bus.session';
import { SeeBusEnumCommands } from '../enum/commands.enum';
import { WhatsappService } from '@client/whatsapp.service';
import { UserSession } from '@session/user-session.interface';
import { State } from '@shared/interfaces/state.interface';
import { backOrDelete } from '@shared/utils/back-or-delete-message.util';

@Injectable()
export class SeeBusMapState implements State<SeeBusesData> {
  readonly stepId = SeeBusEnumCommands.SEE_BUS_MAP_STATE;
  constructor(private readonly whatsapp: WhatsappService) {}
  async handle(message: Message, session: UserSession<SeeBusesData>) {
    const ubicationNum = Number(message.body.trim());
    if (ubicationNum === 2) {
      return;
    } else if (ubicationNum === 1) {
      const mapResponse = await seeBusMapGenerator(
        session.data.lat,
        session.data.lng,
      );

      const media = new MessageMedia(
        'image/png',
        mapResponse.buffer.toString('base64'),
      );

      let messageCaption = `Se encuentra en \n📍 *${mapResponse.location}*`;
      messageCaption = backOrDelete(messageCaption);
      await this.whatsapp.sendPhotoWithCaption(
        message.from,
        media,
        messageCaption,
      );
      session.steps.push(SeeBusEnumCommands.LAST_STEP);
      return session;
    }
  }
}
