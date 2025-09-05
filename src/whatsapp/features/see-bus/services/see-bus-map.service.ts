import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message, MessageMedia } from 'whatsapp-web.js';
import { SeeBusesData } from '../see-bus.session';
import { seeBusMapGenerator } from '../infra/map-generator.service';
import { backOrDelete } from 'src/whatsapp/shared/utils/back-or-delete-message.util';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';

export async function seeBusMap(
  message: Message,
  whatsappClient: WhatsappService,
  session: UserSession<SeeBusesData>,
): Promise<UserSession<SeeBusesData> | undefined> {
  const ubicationNum = Number(message.body.trim());
  if (ubicationNum === 2) {
    return;
  } else if (ubicationNum === 1) {
    // Quizás queda más limpio sin el siguiente mensaje?
    // await client.sendMessage(message.from, '⏱️ Cargando ubicación...');
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
    await whatsappClient.sendPhotoWithCaption(
      message.from,
      media,
      messageCaption,
    );
    session.step = 5;
    return session;
  }
}
