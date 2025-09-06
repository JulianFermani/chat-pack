import { Message, MessageTypes } from 'whatsapp-web.js';
import { stickerMediaSender } from '../../shared/services/sticker-media-sender.service';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';

export async function stickerDirectMessageSender(
  message: Message,
  whatsappClient: WhatsappService,
) {
  if (
    message.type == MessageTypes.IMAGE ||
    message.type == MessageTypes.VIDEO
  ) {
    await stickerMediaSender(message, whatsappClient, true);
  } else if (message.type == MessageTypes.STICKER) {
    await stickerMediaSender(message, whatsappClient, false);
  }
  return;
}
