import { Injectable } from '@nestjs/common';
import { State } from '../../../shared/interfaces/state.interface';
import { SeeBusesData } from '../see-bus.session';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message, MessageMedia } from 'whatsapp-web.js';
import { seeBusMapGenerator } from '../infra/map-generator.service';
import { backOrDelete } from 'src/whatsapp/shared/utils/back-or-delete-message.util';

@Injectable()
export class SeeBusMapState implements State<SeeBusesData> {
  readonly stepId = 4;
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
      session.step = 5;
      return session;
    }
  }
}
