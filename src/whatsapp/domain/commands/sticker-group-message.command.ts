import { Message, Client } from 'whatsapp-web.js';
import { Command } from './interfaces/command.interface';
import { UserSession } from '../../session/user-session.interface';
import { mediaSender } from './services/media-sender.service';

export class StickerGroupMessageCommand implements Command {
  name = 'stickerGroupMessage';
  description =
    'Convierte una foto o un video a sticker y viceversa de un grupo';
  usesSession = false;

  async execute(message: Message, client: Client): Promise<UserSession | void> {
    if (
      message.body.toLocaleLowerCase().includes('sticker') &&
      message.hasMedia
    ) {
      await mediaSender(message, client, true);
    } else if (
      message.body.toLocaleLowerCase().includes('sticker') &&
      message.hasQuotedMsg
    ) {
      const quotedMsg = await message.getQuotedMessage();
      if (quotedMsg.hasMedia) {
        await mediaSender(quotedMsg, client, true);
      } else {
        void message.reply('*[❎]* Responde una imagen primero');
      }
    } else if (
      message.body.toLocaleLowerCase().includes('imagen') &&
      message.hasQuotedMsg
    ) {
      const quotedMsg = await message.getQuotedMessage();
      if (quotedMsg.hasMedia) {
        await mediaSender(quotedMsg, client, false);
      } else {
        void message.reply('*[❎]* Responde un sticker primero');
      }
    }
    return;
  }
}
