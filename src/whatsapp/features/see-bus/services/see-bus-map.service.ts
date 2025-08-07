import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Client, Message, MessageMedia } from 'whatsapp-web.js';
import { SeeBusesData } from '../see-bus.session';
import { seeBusMapGenerator } from '../infra/map-generator.service';

export async function seeBusMap(
  message: Message,
  client: Client,
  session: UserSession<SeeBusesData>,
): Promise<void> {
  const ubicationNum = Number(message.body.trim());
  if (ubicationNum === 0) {
    return;
  } else if (ubicationNum === 1) {
    await client.sendMessage(message.from, '⏱️ Cargando ubicación...');
    const mapResponse = await seeBusMapGenerator(
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
    return;
  }
}
