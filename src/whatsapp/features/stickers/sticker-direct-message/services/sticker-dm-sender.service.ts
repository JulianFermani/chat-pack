import { Client, Message, MessageTypes } from 'whatsapp-web.js';
import { stickerMediaSender } from '../../shared/services/sticker-media-sender.service';

export async function stickerDirectMessageSender(
  message: Message,
  client: Client,
) {
  if (
    message.type == MessageTypes.IMAGE ||
    message.type == MessageTypes.VIDEO
  ) {
    await stickerMediaSender(message, client, true);
  } else if (message.type == MessageTypes.STICKER) {
    await stickerMediaSender(message, client, false);
  }
  return;
}
