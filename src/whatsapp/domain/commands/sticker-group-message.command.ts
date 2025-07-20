import { Message, Client } from 'whatsapp-web.js';
import { Command } from './interfaces/command.interface';
import { UserSession } from '../../session/user-session.interface';
import { mediaSender } from './services/media-sender.service';

export class StickerGroupMessageCommand implements Command {
  name = 'stickerGroupMessage';
  description =
    'Convierte una foto o video a sticker, y viceversa, dentro de un grupo.\n Para usarlo no hace falta el comando: simplemente enviá una imagen o video con la palabra "sticker", o respondé uno con esa palabra para convertirlo.\nPara convertir un sticker en imagen, respondé con la palabra "imagen".';
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
