import { Client, Message } from 'whatsapp-web.js';
import { stickerMediaSender } from '../../shared/services/sticker-media-sender.service';

export async function stickerGroupMessageSender(
  message: Message,
  client: Client,
) {
  if (
    message.body.toLocaleLowerCase().includes('sticker') &&
    message.hasMedia
  ) {
    await stickerMediaSender(message, client, true);
  } else if (
    message.body.toLocaleLowerCase().includes('sticker') &&
    message.hasQuotedMsg
  ) {
    const quotedMsg = await message.getQuotedMessage();
    if (quotedMsg.hasMedia) {
      await stickerMediaSender(quotedMsg, client, true);
    } else {
      await message.reply('*[❎]* Responde una imagen primero');
    }
  } else if (
    message.body.toLocaleLowerCase().includes('imagen') &&
    message.hasQuotedMsg
  ) {
    const quotedMsg = await message.getQuotedMessage();
    if (quotedMsg.hasMedia) {
      await stickerMediaSender(quotedMsg, client, false);
    } else {
      await message.reply('*[❎]* Responde un sticker primero');
    }
  }
  return;
}
