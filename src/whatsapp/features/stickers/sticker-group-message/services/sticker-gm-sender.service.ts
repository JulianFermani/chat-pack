import { Message } from 'whatsapp-web.js';
import { stickerMediaSender } from '../../shared/services/sticker-media-sender.service';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';

export async function stickerGroupMessageSender(
  message: Message,
  whatsappClient: WhatsappService,
) {
  if (
    message.body.toLocaleLowerCase().includes('sticker') &&
    message.hasMedia
  ) {
    await stickerMediaSender(message, whatsappClient, true);
  } else if (
    message.body.toLocaleLowerCase().includes('sticker') &&
    message.hasQuotedMsg
  ) {
    const quotedMsg = await message.getQuotedMessage();
    if (quotedMsg.hasMedia) {
      await stickerMediaSender(quotedMsg, whatsappClient, true);
    } else {
      await message.reply('*[❎]* Responde una imagen primero');
    }
  } else if (
    message.body.toLocaleLowerCase().includes('imagen') &&
    message.hasQuotedMsg
  ) {
    const quotedMsg = await message.getQuotedMessage();
    if (quotedMsg.hasMedia) {
      await stickerMediaSender(quotedMsg, whatsappClient, false);
    } else {
      await message.reply('*[❎]* Responde un sticker primero');
    }
  }
  return;
}
