import { Message, MessageTypes } from 'whatsapp-web.js';

import { WhatsappService } from '@client/whatsapp.service';
import { stickerMediaSender } from '@features/stickers/shared/services/sticker-media-sender.service';

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
